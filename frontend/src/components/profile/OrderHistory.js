import React from 'react';
import {
  Box,
  Typography,
  Card,
  CardContent,
  Grid,
  Chip,
  Divider,
  Button
} from '@mui/material';
import {
  LocalShipping as ShippingIcon,
  Payment as PaymentIcon,
  CalendarToday as CalendarIcon
} from '@mui/icons-material';

const statusColors = {
  Paid: 'primary',
  Shipped: 'info',
  Delivered: 'success',
  Undelivered: 'error'
};

const paymentStatusColors = {
  Pending: 'warning',
  Completed: 'success',
  Failed: 'error'
};

export default function OrderHistory({ orders }) {
  if (!orders || orders.length === 0) {
    return (
      <Typography color="text.secondary" align="center">
        No orders found
      </Typography>
    );
  }

  return (
    <Box>
      {orders.map((order) => (
        <Card key={order._id} sx={{ mb: 2 }}>
          <CardContent>
            <Grid container spacing={2}>
              <Grid xs={12} sm={6}>
                <Typography variant="h6" gutterBottom>
                  Order #{order._id.slice(-6)}
                </Typography>
                <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                  <CalendarIcon sx={{ mr: 1, fontSize: 20 }} />
                  <Typography variant="body2" color="text.secondary">
                    {new Date(order.createdAt).toLocaleDateString()}
                  </Typography>
                </Box>
                <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                  <PaymentIcon sx={{ mr: 1, fontSize: 20 }} />
                  <Typography variant="body2" color="text.secondary">
                    Total: ${order.totalPrice}
                  </Typography>
                </Box>
              </Grid>
              <Grid xs={12} sm={6}>
                <Box sx={{ display: 'flex', justifyContent: { xs: 'flex-start', sm: 'flex-end' }, gap: 1, mb: 2 }}>
                  <Chip
                    label={order.status}
                    color={statusColors[order.status]}
                    size="small"
                  />
                  <Chip
                    label={order.paymentStatus}
                    color={paymentStatusColors[order.paymentStatus]}
                    size="small"
                  />
                </Box>
                {order.assignedRider && (
                  <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: { xs: 'flex-start', sm: 'flex-end' } }}>
                    <ShippingIcon sx={{ mr: 1, fontSize: 20 }} />
                    <Typography variant="body2" color="text.secondary">
                      Rider Assigned
                    </Typography>
                  </Box>
                )}
              </Grid>
            </Grid>

            <Divider sx={{ my: 2 }} />

            <Grid container spacing={2}>
              <Grid xs={12}>
                <Typography variant="subtitle2" gutterBottom>
                  Delivery Address
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  {order.customerDetails.name}<br />
                  {order.customerDetails.address.street}<br />
                  {order.customerDetails.address.city}, {order.customerDetails.address.state} {order.customerDetails.address.postalCode}<br />
                  Phone: {order.customerDetails.phone}
                </Typography>
              </Grid>
            </Grid>

            <Box sx={{ mt: 2, display: 'flex', justifyContent: 'flex-end' }}>
              <Button
                variant="outlined"
                size="small"
                onClick={() => {/* TODO: Implement order details view */}}
              >
                View Details
              </Button>
            </Box>
          </CardContent>
        </Card>
      ))}
    </Box>
  );
} 