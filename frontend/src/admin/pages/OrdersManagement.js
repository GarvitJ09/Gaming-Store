import React, { useState, useEffect } from 'react';
import {
  Box,
  Typography,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  CircularProgress,
  Alert,
  Chip,
  IconButton,
  Tooltip,
} from '@mui/material';
import { orderService } from '../../services/orderService';
import { riderService } from '../../services/riderService';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import LocalShippingIcon from '@mui/icons-material/LocalShipping';
import CancelIcon from '@mui/icons-material/Cancel';

const statusColors = {
  Pending: 'warning',
  Paid: 'info',
  Processing: 'primary',
  Shipped: 'secondary',
  Delivered: 'success',
  Cancelled: 'error',
};

const OrdersManagement = () => {
  const [orders, setOrders] = useState([]);
  const [riders, setRiders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [selectedRider, setSelectedRider] = useState('');
  const [openDialog, setOpenDialog] = useState(false);
  const [newProduct, setNewProduct] = useState({
    title: '',
    price: 0,
    variants: [],
  });
  const [variant, setVariant] = useState({ color: '', size: '', stock: 0 });

  useEffect(() => {
    fetchOrders();
    fetchRiders();
  }, []);

  const fetchOrders = async () => {
    try {
      setLoading(true);
      const response = await orderService.getAllOrders();
      setOrders(response.orders || []);
      setError('');
    } catch (err) {
      setError('Failed to fetch orders');
      console.error('Error fetching orders:', err);
    } finally {
      setLoading(false);
    }
  };

  const fetchRiders = async () => {
    try {
      const data = await riderService.getAllRiders();
      setRiders(data);
    } catch (err) {
      console.error('Error fetching riders:', err);
    }
  };

  const handleStatusChange = async (orderId, newStatus) => {
    try {
      if (newStatus === 'Shipped') {
        setSelectedOrder(orderId);
        setOpenDialog(true);
      } else {
        await orderService.updateOrderStatus(orderId, newStatus);
        fetchOrders();
      }
    } catch (err) {
      setError('Failed to update order status');
      console.error('Error updating order status:', err);
    }
  };

  const handleAssignRider = async () => {
    try {
      await orderService.assignRider(selectedOrder, selectedRider);
      await orderService.updateOrderStatus(selectedOrder, 'Shipped');
      setOpenDialog(false);
      setSelectedRider('');
      fetchOrders();
    } catch (err) {
      setError('Failed to assign rider');
      console.error('Error assigning rider:', err);
    }
  };

  const getPendingOrdersCount = () => {
    return orders.filter((order) =>
      ['Pending', 'Paid', 'Processing'].includes(order.status)
    ).length;
  };

  const getTotalAmount = () => {
    return orders.reduce((total, order) => total + (order.totalPrice || 0), 0);
  };

  const handleAddProduct = () => {
    // Call API to add product
    console.log('Adding product:', newProduct);
  };

  const handleAddVariant = () => {
    setNewProduct((prev) => ({
      ...prev,
      variants: [...prev.variants, variant],
    }));
    setVariant({ color: '', size: '', stock: 0 });
  };

  if (loading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', mt: 4 }}>
        <CircularProgress />
      </Box>
    );
  }

  return (
    <Box>
      <Typography variant='h4' gutterBottom>
        Orders Management
      </Typography>

      <Box sx={{ display: 'flex', gap: 3, mb: 3 }}>
        <Paper sx={{ p: 2, flex: 1 }}>
          <Typography variant='h6' color='primary'>
            Pending Orders: {getPendingOrdersCount()}
          </Typography>
        </Paper>
        <Paper sx={{ p: 2, flex: 1 }}>
          <Typography variant='h6' color='primary'>
            Total Amount: ${getTotalAmount().toFixed(2)}
          </Typography>
        </Paper>
      </Box>

      {error && (
        <Alert severity='error' sx={{ mb: 2 }}>
          {error}
        </Alert>
      )}

      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Order ID</TableCell>
              <TableCell>Customer</TableCell>
              <TableCell>Total</TableCell>
              <TableCell>Status</TableCell>
              <TableCell>Rider</TableCell>
              <TableCell>Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {orders.map((order) => (
              <TableRow key={order._id}>
                <TableCell>{order._id}</TableCell>
                <TableCell>{order.user?.email || 'N/A'}</TableCell>
                <TableCell>${order.totalPrice?.toFixed(2) || '0.00'}</TableCell>
                <TableCell>
                  <Chip
                    label={order.status}
                    color={statusColors[order.status] || 'default'}
                    size='small'
                  />
                </TableCell>
                <TableCell>
                  {order.assignedRider?.name || 'Not assigned'}
                </TableCell>
                <TableCell>
                  <Box sx={{ display: 'flex', gap: 1 }}>
                    {order.status === 'Pending' && (
                      <Tooltip title='Mark as Paid'>
                        <IconButton
                          color='primary'
                          onClick={() => handleStatusChange(order._id, 'Paid')}
                        >
                          <CheckCircleIcon />
                        </IconButton>
                      </Tooltip>
                    )}
                    {order.status === 'Paid' && (
                      <Tooltip title='Ship Order'>
                        <IconButton
                          color='primary'
                          onClick={() =>
                            handleStatusChange(order._id, 'Shipped')
                          }
                        >
                          <LocalShippingIcon />
                        </IconButton>
                      </Tooltip>
                    )}
                    {order.status === 'Shipped' && (
                      <Tooltip title='Mark as Delivered'>
                        <IconButton
                          color='success'
                          onClick={() =>
                            handleStatusChange(order._id, 'Delivered')
                          }
                        >
                          <CheckCircleIcon />
                        </IconButton>
                      </Tooltip>
                    )}
                    {['Pending', 'Paid', 'Processing'].includes(
                      order.status
                    ) && (
                      <Tooltip title='Cancel Order'>
                        <IconButton
                          color='error'
                          onClick={() =>
                            handleStatusChange(order._id, 'Cancelled')
                          }
                        >
                          <CancelIcon />
                        </IconButton>
                      </Tooltip>
                    )}
                  </Box>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>

      <Dialog open={openDialog} onClose={() => setOpenDialog(false)}>
        <DialogTitle>Assign Rider</DialogTitle>
        <DialogContent>
          <FormControl fullWidth sx={{ mt: 2 }}>
            <InputLabel>Select Rider</InputLabel>
            <Select
              value={selectedRider}
              onChange={(e) => setSelectedRider(e.target.value)}
            >
              {riders.map((rider) => (
                <MenuItem key={rider._id} value={rider._id}>
                  {rider.name}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpenDialog(false)}>Cancel</Button>
          <Button
            onClick={handleAssignRider}
            variant='contained'
            disabled={!selectedRider}
          >
            Assign
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default OrdersManagement;
