import React, { useState, useEffect } from 'react';
import {
  Box,
  Typography,
  Paper,
  List,
  ListItem,
  ListItemText,
  CircularProgress,
} from '@mui/material';
import { useNavigate } from 'react-router-dom';
import { riderService } from '../services/riderService';

export default function RiderDashboard() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const navigate = useNavigate();

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

  if (loading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', mt: 4 }}>
        <CircularProgress />
      </Box>
    );
  }

  if (error) {
    return (
      <Typography
        variant='h6'
        color='error'
        sx={{ textAlign: 'center', mt: 4 }}
      >
        {error}
      </Typography>
    );
  }

  return (
    <Box sx={{ padding: 2 }}>
      <Typography variant='h5' gutterBottom>
        Assigned Orders
      </Typography>
      <Paper>
        <List>
          {orders.map((order) => (
            <ListItem
              key={order._id}
              button
              onClick={() => navigate(`/order/${order._id}`)}
            >
              <ListItemText
                primary={`Order #${order._id}`}
                secondary={`Status: ${order.status}`}
              />
            </ListItem>
          ))}
        </List>
      </Paper>
    </Box>
  );
}
