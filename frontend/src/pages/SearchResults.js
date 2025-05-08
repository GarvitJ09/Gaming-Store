import React, { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import {
  Container,
  Grid,
  Typography,
  Box,
  CircularProgress,
  Alert,
  Card,
  CardContent,
  CardMedia,
  Button,
  Chip
} from '@mui/material';
import { searchService } from '../services/searchService';

export default function SearchResults() {
  const [searchParams] = useSearchParams();
  const query = searchParams.get('q');
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchResults = async () => {
      if (!query) return;
      
      try {
        setLoading(true);
        const data = await searchService.searchProducts(query);
        setResults(data);
        setError('');
      } catch (err) {
        setError('Failed to fetch search results');
        console.error('Error fetching search results:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchResults();
  }, [query]);

  if (loading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '50vh' }}>
        <CircularProgress />
      </Box>
    );
  }

  if (error) {
    return (
      <Container sx={{ py: 4 }}>
        <Alert severity="error">{error}</Alert>
      </Container>
    );
  }

  if (!query) {
    return (
      <Container sx={{ py: 4 }}>
        <Alert severity="info">Please enter a search term</Alert>
      </Container>
    );
  }

  if (results.length === 0) {
    return (
      <Container sx={{ py: 4 }}>
        <Typography variant="h5" gutterBottom>
          No results found for "{query}"
        </Typography>
        <Alert severity="info">
          Try different keywords or check your spelling
        </Alert>
      </Container>
    );
  }

  return (
    <Container sx={{ py: 4 }}>
      <Typography variant="h5" gutterBottom>
        Search Results for "{query}"
      </Typography>
      <Typography variant="body2" color="text.secondary" gutterBottom>
        Found {results.length} results
      </Typography>

      <Grid container spacing={3} sx={{ mt: 2 }}>
        {results.map((product) => (
          <Grid item xs={12} sm={6} md={4} key={product._id}>
            <Card>
              <CardMedia
                component="img"
                height="200"
                image={product.variants[0]?.image || 'https://via.placeholder.com/200'}
                alt={product.title}
                sx={{ objectFit: 'contain', p: 2 }}
              />
              <CardContent>
                <Typography variant="h6" gutterBottom noWrap>
                  {product.title}
                </Typography>
                <Typography variant="body2" color="text.secondary" gutterBottom>
                  {product.description}
                </Typography>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mt: 2 }}>
                  <Typography variant="h6" color="primary">
                    ${product.variants[0]?.price}
                  </Typography>
                  <Chip
                    label={product.category}
                    size="small"
                    color="primary"
                    variant="outlined"
                  />
                </Box>
                <Button
                  variant="contained"
                  fullWidth
                  sx={{ mt: 2 }}
                  onClick={() => window.location.href = `/product/${product._id}`}
                >
                  View Details
                </Button>
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>
    </Container>
  );
} 