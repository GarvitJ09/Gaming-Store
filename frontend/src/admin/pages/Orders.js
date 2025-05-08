import React, { useState, useEffect } from 'react';
import {
  Container,
  Typography,
  Table,
  TableHead,
  TableRow,
  TableCell,
  TableBody,
  Button,
} from '@mui/material';

export default function Orders() {
  const [orders, setOrders] = useState([]);

  useEffect(() => {
    // Fetch orders from the backend
    async function fetchOrders() {
      const response = await fetch('/api/admin/orders');
      const data = await response.json();
      setOrders(data);
    }
    fetchOrders();
  }, []);

  const handleStatusChange = async (orderId, status) => {
    await fetch(`/api/admin/orders/${orderId}`, {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ status }),
    });
    // Refresh orders after status change
    const response = await fetch('/api/admin/orders');
    const data = await response.json();
    setOrders(data);
  };

  return (
    <Container>
      <Typography variant='h4' gutterBottom>
        Manage Orders
      </Typography>
      <Table>
        <TableHead>
          <TableRow>
            <TableCell>Order ID</TableCell>
            <TableCell>Status</TableCell>
            <TableCell>Actions</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {orders.map((order) => (
            <TableRow key={order.id}>
              <TableCell>{order.id}</TableCell>
              <TableCell>{order.status}</TableCell>
              <TableCell>
                {order.status === 'Paid' && (
                  <Button
                    variant='contained'
                    color='primary'
                    onClick={() => handleStatusChange(order.id, 'Shipped')}
                  >
                    Mark as Shipped
                  </Button>
                )}
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </Container>
  );
}
