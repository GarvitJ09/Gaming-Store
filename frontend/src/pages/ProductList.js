import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Container,
  Grid,
  Card,
  CardContent,
  CardMedia,
  Typography,
  Box,
  Rating,
} from '@mui/material';
import { productService } from '../services/productService';

export default function ProductList() {
  const navigate = useNavigate();
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    fetchProducts();
  }, []);

  const fetchProducts = async () => {
    try {
      setLoading(true);
      const data = await productService.getAllProducts();
      setProducts(data);
      setError('');
    } catch (err) {
      setError('Failed to fetch products. Please try again later.');
      console.error('Error fetching products:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleProductClick = (productId) => {
    navigate(`/product/${productId}`);
  };

  return (
    <Container sx={{ py: 4 }}>
      <Typography variant='h4' gutterBottom>
        Products
      </Typography>
      {error && <Typography color='error'>{error}</Typography>}
      {loading ? (
        <Typography>Loading...</Typography>
      ) : (
        <Grid container spacing={3}>
          {products.map((product) => {
            const firstVariant = product.variants[0]; // Use the first variant for price and image
            return (
              <Grid item xs={12} sm={6} md={4} lg={3} key={product._id}>
                <Card
                  sx={{
                    maxWidth: 300,
                    borderRadius: 3,
                    boxShadow: 3,
                    cursor: 'pointer',
                    transition: 'transform 0.2s',
                    '&:hover': {
                      transform: 'scale(1.05)',
                    },
                  }}
                  onClick={() => handleProductClick(product._id)}
                >
                  <CardMedia
                    component='img'
                    height='200'
                    image={firstVariant?.image || '/placeholder.png'} // Placeholder image if no variant image
                    alt={product.title}
                    sx={{
                      objectFit: 'contain',
                      bgcolor: '#f5f5f5',
                    }}
                  />
                  <CardContent>
                    <Typography
                      gutterBottom
                      variant='h6'
                      component='div'
                      noWrap
                    >
                      {product.title}
                    </Typography>
                    <Typography variant='body2' color='text.secondary' noWrap>
                      {product.brand} - {product.category}
                    </Typography>
                    <Box
                      sx={{
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'space-between',
                        mt: 1,
                      }}
                    >
                      <Typography
                        variant='subtitle1'
                        fontWeight='bold'
                        color='primary'
                      >
                        ${firstVariant?.price || 'N/A'}
                      </Typography>
                      <Rating
                        name='read-only'
                        value={product.ratings.average}
                        precision={0.5}
                        readOnly
                        size='small'
                      />
                    </Box>
                    <Typography
                      variant='caption'
                      color='text.secondary'
                      sx={{ mt: 1 }}
                    >
                      {product.ratings.count} reviews
                    </Typography>
                  </CardContent>
                </Card>
              </Grid>
            );
          })}
        </Grid>
      )}
    </Container>
  );
}
