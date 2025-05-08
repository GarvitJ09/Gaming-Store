import React from 'react';
import {
  Card,
  CardMedia,
  CardContent,
  Typography,
  CardActions,
  Button,
  Chip,
  Stack,
} from '@mui/material';

const ProductCard = ({ product, onViewDetails }) => {
  const handleViewDetails = () => {
    if (onViewDetails && product._id) {
      onViewDetails(product._id);
    }
  };

  return (
    <Card sx={{ maxWidth: 300, borderRadius: 3, boxShadow: 3 }}>
      {product.image && (
        <CardMedia
          component='img'
          height='200'
          image={product.image}
          alt={product.title}
          sx={{ objectFit: 'contain', bgcolor: '#f5f5f5' }}
        />
      )}

      <CardContent>
        <Typography gutterBottom variant='h6' component='div' noWrap>
          {product.title}
        </Typography>
        <Typography variant='body2' color='text.secondary' noWrap>
          {product.description}
        </Typography>
        <Typography variant='subtitle1' fontWeight='bold' mt={1}>
          ₹{product.price}
        </Typography>

        <Stack direction='row' spacing={1} mt={1} flexWrap='wrap'>
          {product.variants?.map((variant, idx) => (
            <Chip
              key={idx}
              label={`${variant.color} - ${variant.size}`}
              size='small'
              variant='outlined'
            />
          ))}
        </Stack>
      </CardContent>

      <CardActions>
        <Button
          size='small'
          color='primary'
          variant='contained'
          onClick={handleViewDetails}
          fullWidth
        >
          View Details
        </Button>
      </CardActions>
    </Card>
  );
};

export default ProductCard;
