import React, { useState, useEffect } from 'react';
import {
  Box,
  Typography,
  Paper,
  Accordion,
  AccordionSummary,
  AccordionDetails,
  CircularProgress,
  Button,
  Alert,
} from '@mui/material';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import { riderService } from '../services/riderService';

export default function Orders() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        setLoading(true);
        const data = await riderService.getMyAssignedOrders();
        setOrders(data);
      } catch (err) {
        setError('Failed to fetch orders');
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchOrders();
  }, []);

  const handleStatusChange = async (orderId) => {
    try {
      setError('');
      setSuccess('');
      const updatedOrder = await riderService.updateOrderStatus(
        orderId,
        'Delivered'
      );
      setOrders((prevOrders) =>
        prevOrders.map((order) =>
          order._id === orderId
            ? { ...order, status: updatedOrder.status }
            : order
        )
      );
      setSuccess('Order marked as Delivered');
    } catch (err) {
      setError('Failed to update order status');
      console.error(err);
    }
  };

  if (loading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', mt: 4 }}>
        <CircularProgress />
      </Box>
    );
  }

  if (error) {
    return (
      <Alert severity='error' sx={{ mt: 4 }}>
        {error}
      </Alert>
    );
  }

  return (
    <Box sx={{ padding: 2 }}>
      <Typography variant='h5' gutterBottom>
        My Orders
      </Typography>
      {success && (
        <Alert severity='success' sx={{ mb: 2 }}>
          {success}
        </Alert>
      )}
      <Paper>
        {orders.map((order) => (
          <Accordion key={order._id}>
            <AccordionSummary
              expandIcon={<ExpandMoreIcon />}
              aria-controls={`panel-${order._id}-content`}
              id={`panel-${order._id}-header`}
            >
              <Typography variant='body1'>
                <strong>Order #:</strong> {order._id}
              </Typography>
              <Typography
                variant='body2'
                color='textSecondary'
                sx={{ marginLeft: 'auto' }}
              >
                {new Date(order.createdAt).toLocaleDateString()}
              </Typography>
            </AccordionSummary>
            <AccordionDetails>
              <Typography variant='body2'>
                <strong>Customer Name:</strong>{' '}
                {order.customerDetails?.name || 'N/A'}
              </Typography>
              <Typography variant='body2'>
                <strong>Customer Phone:</strong>{' '}
                {order.customerDetails?.phone || 'N/A'}
              </Typography>
              <Typography variant='body2'>
                <strong>Address:</strong>{' '}
                {order.customerDetails?.address || 'N/A'}
              </Typography>
              <Box sx={{ mt: 1 }}>
                <Typography variant='body2'>
                  <strong>Products:</strong>
                </Typography>
                {order.items && order.items.length > 0 ? (
                  <ul>
                    {order.items.map((item, index) => (
                      <li key={index}>
                        {item.name} - Quantity: {item.quantity}
                      </li>
                    ))}
                  </ul>
                ) : (
                  <Typography variant='body2'>N/A</Typography>
                )}
              </Box>
              <Typography variant='body2'>
                <strong>Status:</strong> {order.status}
              </Typography>
              <Typography variant='body2'>
                <strong>Payment Method:</strong> {order.paymentMethod || 'N/A'}
              </Typography>
              <Typography variant='body2'>
                <strong>Total Price:</strong> ${order.totalPrice || 'N/A'}
              </Typography>
              <Box sx={{ mt: 2 }}>
                {order.status === 'Shipped' && (
                  <Button
                    variant='contained'
                    color='success'
                    onClick={() => handleStatusChange(order._id)}
                  >
                    Mark as Delivered
                  </Button>
                )}
              </Box>
            </AccordionDetails>
          </Accordion>
        ))}
      </Paper>
    </Box>
  );
}
