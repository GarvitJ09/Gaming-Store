// src/pages/Checkout.js
import React, { useState } from 'react';
import {
  Container,
  Grid,
  Typography,
  TextField,
  Button,
  Box,
  Divider,
  Paper,
  Modal,
} from '@mui/material';
import { useCart } from '../contexts/CartContext';
import { toast } from 'react-toastify';
import { orderService } from '../services/orderService';

const Checkout = () => {
  const { cart, calculateTotal, clearCart } = useCart();
  const [userDetails, setUserDetails] = useState({
    name: '',
    phone: '',
    address: '',
  });
  const [loading, setLoading] = useState(false);
  const [orderPlaced, setOrderPlaced] = useState(false); // State for confirmation modal

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setUserDetails((prev) => ({ ...prev, [name]: value }));
  };

  const handlePlaceOrder = async () => {
    if (!userDetails.name || !userDetails.phone || !userDetails.address) {
      toast.error('Please fill in all the required fields.');
      return;
    }

    try {
      setLoading(true);
      const orderData = {
        items: cart.map((item) => ({
          productId: item.product._id,
          variant: item.variant,
          quantity: item.quantity,
          price: item.price,
        })),
        total: calculateTotal(),
        userDetails,
        paymentMethod: 'cash_on_delivery', // Hardcoded payment method
      };

      await orderService.createOrder(orderData);
      clearCart(); // Clear the cart after placing the order
      setOrderPlaced(true); // Show confirmation modal
    } catch (error) {
      console.error('Error placing order:', error);
      toast.error('Failed to place order. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Container sx={{ py: 4 }}>
      <Typography variant='h4' gutterBottom>
        Checkout
      </Typography>
      <Grid container spacing={3}>
        {/* Cart Summary */}
        <Grid item xs={12} md={8}>
          <Paper sx={{ p: 3 }}>
            <Typography variant='h6' gutterBottom>
              Order Summary
            </Typography>
            <Divider sx={{ my: 2 }} />
            {cart.map((item) => (
              <Box
                key={`${item.product._id}-${item.variant.color}-${item.variant.size}`}
                sx={{ mb: 2 }}
              >
                <Typography variant='body1'>
                  {item.product.title} ({item.variant.color} -{' '}
                  {item.variant.size})
                </Typography>
                <Typography variant='body2' color='text.secondary'>
                  ${item.price.toFixed(2)} x {item.quantity}
                </Typography>
              </Box>
            ))}
            <Divider sx={{ my: 2 }} />
            <Typography variant='h6'>
              Total: ${calculateTotal().toFixed(2)}
            </Typography>
          </Paper>
        </Grid>

        {/* User Details and Payment */}
        <Grid item xs={12} md={4}>
          <Paper sx={{ p: 3 }}>
            <Typography variant='h6' gutterBottom>
              Shipping Details
            </Typography>
            <Divider sx={{ my: 2 }} />
            <TextField
              fullWidth
              label='Name'
              name='name'
              value={userDetails.name}
              onChange={handleInputChange}
              sx={{ mb: 2 }}
            />
            <TextField
              fullWidth
              label='Phone'
              name='phone'
              value={userDetails.phone}
              onChange={handleInputChange}
              sx={{ mb: 2 }}
            />
            <TextField
              fullWidth
              label='Address'
              name='address'
              value={userDetails.address}
              onChange={handleInputChange}
              multiline
              rows={3}
              sx={{ mb: 2 }}
            />
            <Typography variant='h6' gutterBottom>
              Payment Method
            </Typography>
            <Typography variant='body1' sx={{ mb: 2 }}>
              Cash on Delivery
            </Typography>
            <Button
              variant='contained'
              color='primary'
              fullWidth
              onClick={handlePlaceOrder}
              disabled={loading}
            >
              {loading ? 'Placing Order...' : 'Place Order'}
            </Button>
          </Paper>
        </Grid>
      </Grid>

      {/* Confirmation Modal */}
      <Modal open={orderPlaced} onClose={() => setOrderPlaced(false)}>
        <Box
          sx={{
            position: 'absolute',
            top: '50%',
            left: '50%',
            transform: 'translate(-50%, -50%)',
            bgcolor: 'background.paper',
            p: 4,
            borderRadius: 2,
            boxShadow: 24,
          }}
        >
          <Typography variant='h6' gutterBottom>
            Order Placed Successfully!
          </Typography>
          <Typography variant='body1'>
            Thank you for your order. Your items will be delivered soon.
          </Typography>
          <Button
            variant='contained'
            color='primary'
            sx={{ mt: 2 }}
            onClick={() => (window.location.href = '/')}
          >
            Go to Home
          </Button>
        </Box>
      </Modal>
    </Container>
  );
};

export default Checkout;
