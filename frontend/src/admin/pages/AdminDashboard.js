import React, { useState, useEffect } from 'react';
import {
  Box,
  Grid,
  Paper,
  Typography,
  CircularProgress,
  Alert,
} from '@mui/material';
import { orderService } from '../../services/orderService';
import { riderService } from '../../services/riderService';

const AdminDashboard = () => {
  const [stats, setStats] = useState({
    totalOrders: 0,
    pendingOrders: 0,
    shippedOrders: 0,
    totalRiders: 0,
    activeRiders: 0
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    try {
      setLoading(true);
      const [ordersResponse, riders] = await Promise.all([
        orderService.getAllOrders(),
        riderService.getAllRiders()
      ]);

      const orders = ordersResponse.orders || [];
      const pendingOrders = orders.filter(order => 
        ['Pending', 'Paid', 'Processing'].includes(order.status)
      ).length;
      const shippedOrders = orders.filter(order => order.status === 'Shipped').length;

      setStats({
        totalOrders: orders.length,
        pendingOrders,
        shippedOrders,
        totalRiders: riders.length,
        activeRiders: riders.length // All riders are considered active since there's no status field
      });
      setError('');
    } catch (err) {
      setError('Failed to fetch dashboard data');
      console.error('Error fetching dashboard data:', err);
    } finally {
      setLoading(false);
    }
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
      <Typography variant="h4" gutterBottom>
        Admin Dashboard
      </Typography>

      {error && (
        <Alert severity="error" sx={{ mb: 2 }}>
          {error}
        </Alert>
      )}

      <Grid container spacing={3}>
        <Grid item xs={12} sm={6} md={3}>
          <Paper sx={{ p: 2 }}>
            <Typography variant="h6" color="primary">
              Total Orders
            </Typography>
            <Typography variant="h4">{stats.totalOrders}</Typography>
          </Paper>
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <Paper sx={{ p: 2 }}>
            <Typography variant="h6" color="warning.main">
              Pending Orders
            </Typography>
            <Typography variant="h4">{stats.pendingOrders}</Typography>
          </Paper>
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <Paper sx={{ p: 2 }}>
            <Typography variant="h6" color="info.main">
              Shipped Orders
            </Typography>
            <Typography variant="h4">{stats.shippedOrders}</Typography>
          </Paper>
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <Paper sx={{ p: 2 }}>
            <Typography variant="h6" color="success.main">
              Total Riders
            </Typography>
            <Typography variant="h4">{stats.activeRiders}</Typography>
          </Paper>
        </Grid>
      </Grid>
    </Box>
  );
};

export default AdminDashboard; 