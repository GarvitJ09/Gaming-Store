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
  Box,
  IconButton,
} from '@mui/material';
import { ArrowBackIos, ArrowForwardIos } from '@mui/icons-material';
import Slider from 'react-slick';
import 'slick-carousel/slick/slick.css';
import 'slick-carousel/slick/slick-theme.css';

// Custom arrow components
const NextArrow = ({ onClick }) => (
  <IconButton
    onClick={onClick}
    sx={{
      position: 'absolute',
      top: '50%',
      right: 8,
      transform: 'translateY(-50%)',
      zIndex: 1,
    }}
    size='small'
  >
    <ArrowForwardIos fontSize='small' />
  </IconButton>
);

const PrevArrow = ({ onClick }) => (
  <IconButton
    onClick={onClick}
    sx={{
      position: 'absolute',
      top: '50%',
      left: 8,
      transform: 'translateY(-50%)',
      zIndex: 1,
    }}
    size='small'
  >
    <ArrowBackIos fontSize='small' />
  </IconButton>
);

const ProductCard = ({ product, onViewDetails }) => {
  const handleViewDetails = () => {
    if (onViewDetails && product._id) {
      onViewDetails(product._id);
    }
  };

  const sliderSettings = {
    dots: true,
    infinite: true,
    speed: 500,
    slidesToShow: 1,
    slidesToScroll: 1,
    nextArrow: <NextArrow />,
    prevArrow: <PrevArrow />,
  };

  return (
    <Card
      sx={{ maxWidth: 300, borderRadius: 3, boxShadow: 3, overflow: 'hidden' }}
    >
      <Box sx={{ position: 'relative' }}>
        {product.variants.some((v) => v.image) && (
          <Slider {...sliderSettings}>
            {product.variants.map((variant, index) =>
              variant.image ? (
                <CardMedia
                  key={index}
                  component='img'
                  height='200'
                  image={variant.image}
                  alt={`${product.title} - ${variant.color}`}
                  sx={{ objectFit: 'contain', bgcolor: '#f5f5f5' }}
                />
              ) : null
            )}
          </Slider>
        )}
      </Box>

      <CardContent>
        <Typography gutterBottom variant='h6' component='div' noWrap>
          {product.title}
        </Typography>
        <Typography variant='body2' color='text.secondary' noWrap>
          {product.description}
        </Typography>
        <Typography variant='subtitle1' fontWeight='bold' mt={1}>
          ${product.variants[0].price}
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
