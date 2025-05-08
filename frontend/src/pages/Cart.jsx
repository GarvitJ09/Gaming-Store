import React from 'react';
import { useCart } from '../contexts/CartContext';
import {
  Container,
  Grid,
  Card,
  CardMedia,
  CardContent,
  Typography,
  Button,
  Box,
  Divider,
  IconButton,
  CircularProgress,
} from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import RemoveIcon from '@mui/icons-material/Remove';
import { toast } from 'react-toastify';
import { useNavigate } from 'react-router-dom';

const Cart = () => {
  const { cart, loading, removeFromCart, updateQuantity, calculateTotal } = useCart();
  const navigate = useNavigate();

  const handleIncrement = (item) => {
    if (item.product && item.variant) {
      // Prevent excessive updates
      const newQuantity = item.quantity + 1;
      if (newQuantity > 10) {
        toast.warning('Maximum quantity is 10 items');
        return;
      }
      updateQuantity(item.product._id, item.variant, newQuantity);
    } else {
      console.error('Invalid cart item:', item);
      toast.error('Cannot update invalid item');
    }
  };

  const handleDecrement = (item) => {
    if (item.product && item.variant) {
      if (item.quantity > 1) {
        updateQuantity(item.product._id, item.variant, item.quantity - 1);
      } else {
        toast.warning(
          'Quantity cannot be less than 1. Use remove button to delete item.'
        );
      }
    } else {
      console.error('Invalid cart item:', item);
      toast.error('Cannot update invalid item');
    }
  };

  if (loading) {
    return (
      <Container sx={{ py: 4, textAlign: 'center' }}>
        <CircularProgress />
        <Typography variant='body1' sx={{ mt: 2 }}>
          Loading your cart...
        </Typography>
      </Container>
    );
  }

  return (
    <Container sx={{ py: 4 }}>
      <Typography variant='h4' gutterBottom>
        Your Cart
      </Typography>
      {cart.length === 0 ? (
        <Typography variant='body1'>Your cart is empty!</Typography>
      ) : (
        <Grid container spacing={3}>
          <Grid item xs={12} md={8}>
            {cart.map((item) => (
              <Card
                key={`${item.product._id}-${item.variant.color}-${item.variant.size}`}
                sx={{ mb: 2 }}
              >
                <Grid container>
                  <Grid item xs={4}>
                    <CardMedia
                      component='img'
                      image={item.product.image || '/placeholder.png'}
                      alt={item.product.title}
                      sx={{ height: 150, objectFit: 'contain' }}
                    />
                  </Grid>
                  <Grid item xs={8}>
                    <CardContent>
                      <Typography variant='h6' gutterBottom>
                        {item.product.title}
                      </Typography>
                      <Typography variant='body2' color='text.secondary'>
                        Color: {item.variant.color}
                      </Typography>
                      <Typography variant='body2' color='text.secondary'>
                        Size: {item.variant.size}
                      </Typography>
                      <Typography variant='body2' color='text.secondary'>
                        Price: ${item.price.toFixed(2)}
                      </Typography>
                      <Box sx={{ display: 'flex', alignItems: 'center', mt: 2 }}>
                        <IconButton
                          size='small'
                          onClick={() => handleDecrement(item)}
                        >
                          <RemoveIcon />
                        </IconButton>
                        <Typography sx={{ mx: 2 }}>{item.quantity}</Typography>
                        <IconButton
                          size='small'
                          onClick={() => handleIncrement(item)}
                        >
                          <AddIcon />
                        </IconButton>
                        <Button
                          color='error'
                          size='small'
                          onClick={() =>
                            removeFromCart(item.product._id, item.variant)
                          }
                          sx={{ ml: 2 }}
                        >
                          Remove
                        </Button>
                      </Box>
                    </CardContent>
                  </Grid>
                </Grid>
              </Card>
            ))}
          </Grid>
          <Grid item xs={12} md={4}>
            <Card>
              <CardContent>
                <Typography variant='h6' gutterBottom>
                  Order Summary
                </Typography>
                <Divider sx={{ my: 2 }} />
                <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 2 }}>
                  <Typography>Subtotal:</Typography>
                  <Typography>${calculateTotal().toFixed(2)}</Typography>
                </Box>
                <Button
                  variant='contained'
                  fullWidth
                  onClick={() => navigate('/checkout')}
                >
                  Proceed to Checkout
                </Button>
              </CardContent>
            </Card>
          </Grid>
        </Grid>
      )}
    </Container>
  );
};

export default Cart;
