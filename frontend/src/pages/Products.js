import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Container,
  Grid,
  Typography,
  CircularProgress,
  Alert,
  Box,
  InputBase,
} from '@mui/material';
import SearchIcon from '@mui/icons-material/Search';
import ProductCard from '../components/ProductCard';
import { productService } from '../services/productService';

export default function Products() {
  const navigate = useNavigate();
  const [products, setProducts] = useState([]);
  const [filteredProducts, setFilteredProducts] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    fetchProducts();
  }, []);

  // Filter products whenever search query changes
  useEffect(() => {
    if (products.length > 0) {
      const filtered = products.filter(product => {
        // Safely check if properties exist before calling toLowerCase()
        const nameMatch = product.name && product.name.toLowerCase().includes(searchQuery.toLowerCase());
        const descriptionMatch = product.description && product.description.toLowerCase().includes(searchQuery.toLowerCase());
        const categoryMatch = product.category && product.category.toLowerCase().includes(searchQuery.toLowerCase());
        
        return nameMatch || descriptionMatch || categoryMatch;
      });
      setFilteredProducts(filtered);
    }
  }, [searchQuery, products]);

  const fetchProducts = async () => {
    try {
      setLoading(true);
      const data = await productService.getAllProducts();
      setProducts(data);
      setFilteredProducts(data); // Initialize filtered products with all products
      setError('');
    } catch (err) {
      setError('Failed to fetch products. Please try again later.');
      console.error('Error fetching products:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleViewDetails = (productId) => {
    navigate(`/products/${productId}`);
  };

  const handleSearchChange = (e) => {
    setSearchQuery(e.target.value);
  };

  if (loading) {
    return (
      <Container sx={{ py: 4 }}>
        <CircularProgress />
      </Container>
    );
  }

  if (error) {
    return (
      <Container sx={{ py: 4 }}>
        <Alert severity='error'>{error}</Alert>
      </Container>
    );
  }

  return (
    <Container sx={{ py: 4 }}>
      <Typography variant='h4' gutterBottom>
        Products
      </Typography>
      
      {/* Search Box */}
      <Box
        component='div'
        sx={{
          position: 'relative',
          borderRadius: 1,
          backgroundColor: 'rgba(0, 0, 0, 0.04)',
          '&:hover': {
            backgroundColor: 'rgba(0, 0, 0, 0.08)',
          },
          marginBottom: 4,
          width: '100%',
        }}
      >
        <Box
          sx={{
            position: 'absolute',
            display: 'flex',
            alignItems: 'center',
            height: '100%',
            pl: 2,
          }}
        >
          <SearchIcon />
        </Box>
        <InputBase
          placeholder='Search products...'
          value={searchQuery}
          onChange={handleSearchChange}
          sx={{
            color: 'inherit',
            width: '100%',
            pl: 6,
            pr: 2,
            py: 1,
          }}
        />
      </Box>

      {/* Products Grid */}
      {filteredProducts.length > 0 ? (
        <Grid container spacing={4}>
          {filteredProducts.map((product) => (
            <Grid item xs={12} sm={6} md={4} key={product._id}>
              <ProductCard 
                product={product}
                onViewDetails={handleViewDetails}
              />
            </Grid>
          ))}
        </Grid>
      ) : (
        <Typography variant="body1" align="center" sx={{ mt: 4 }}>
          No products match your search criteria.
        </Typography>
      )}
    </Container>
  );
}