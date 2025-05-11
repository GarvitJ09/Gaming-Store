import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import {
  Container,
  Grid,
  Typography,
  Box,
  Button,
  Paper,
  Divider,
  Rating,
  Alert,
  CircularProgress,
  Radio,
  RadioGroup,
  FormControlLabel,
  FormControl,
  FormLabel,
  Select,
  MenuItem,
  InputLabel,
  Card,
  IconButton,
  Breadcrumbs,
  Link,
  CardMedia,
} from '@mui/material';
import ShoppingCartIcon from '@mui/icons-material/ShoppingCart';
import FavoriteIcon from '@mui/icons-material/Favorite';
import FavoriteBorderIcon from '@mui/icons-material/FavoriteBorder';
import Slider from 'react-slick';
import { productService } from '../services/productService';
import { useCart } from '../contexts/CartContext';
import { ArrowBackIos, ArrowForwardIos } from '@mui/icons-material';

export default function ProductDetail() {
  const { addToCart } = useCart();
  const { id } = useParams();
  const navigate = useNavigate();
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [selectedColor, setSelectedColor] = useState('');
  const [selectedSize, setSelectedSize] = useState('');
  const [selectedVariant, setSelectedVariant] = useState(null);
  const [isWishlist, setIsWishlist] = useState(false);

  useEffect(() => {
    fetchProduct();
  }, [id]);

  const fetchProduct = async () => {
    try {
      setLoading(true);
      const data = await productService.getProductById(id);
      setProduct(data);
      if (data.variants.length > 0) {
        setSelectedColor(data.variants[0].color);
        setSelectedSize(data.variants[0].size);
        setSelectedVariant(data.variants[0]);
      }
      setError('');
    } catch (err) {
      setError('Failed to fetch product details. Please try again later.');
      console.error('Error fetching product:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleColorChange = (color) => {
    setSelectedColor(color);
    const variant = product.variants.find(
      (v) => v.color === color && v.size === selectedSize
    );
    setSelectedVariant(variant);
  };

  const handleSizeChange = (size) => {
    setSelectedSize(size);
    const variant = product.variants.find(
      (v) => v.color === selectedColor && v.size === size
    );
    setSelectedVariant(variant);
  };

  const getAvailableSizes = (color) => {
    return [
      ...new Set(
        product.variants
          .filter((v) => v.color === color && v.stock > 0)
          .map((v) => v.size)
      ),
    ];
  };

  const getAvailableColors = () => {
    return [...new Set(product.variants.map((v) => v.color))];
  };

  const handleAddToCart = () => {
    if (selectedVariant) {
      addToCart(product._id, selectedVariant, 1);
    }
  };

  const carouselSettings = {
    dots: true,
    infinite: true,
    speed: 500,
    slidesToShow: 1,
    slidesToScroll: 1,
    arrows: true,
  };

  if (loading) {
    return (
      <Box
        sx={{
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          height: '100vh',
        }}
      >
        <CircularProgress />
      </Box>
    );
  }

  if (error) {
    return (
      <Container sx={{ py: 4 }}>
        <Alert severity='error'>{error}</Alert>
      </Container>
    );
  }

  if (!product) {
    return (
      <Container sx={{ py: 4 }}>
        <Alert severity='info'>Product not found</Alert>
      </Container>
    );
  }

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
    <Container sx={{ py: 4 }}>
      <Breadcrumbs sx={{ mb: 3 }}>
        <Link
          color='inherit'
          href='/'
          onClick={(e) => {
            e.preventDefault();
            navigate('/');
          }}
        >
          Home
        </Link>
        <Link
          color='inherit'
          href={`/category/${product.category}`}
          onClick={(e) => {
            e.preventDefault();
            navigate(`/category/${product.category}`);
          }}
        >
          {product.category}
        </Link>
        <Typography color='text.primary'>{product.title}</Typography>
      </Breadcrumbs>

      <Grid container spacing={4}>
        {/* Image Carousel */}
        <Grid item xs={12} md={6}>
          <Card>
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
          </Card>
        </Grid>

        {/* Product Details */}
        <Grid item xs={12} md={6}>
          <Paper elevation={0} sx={{ p: 3 }}>
            <Typography variant='h4' component='h1' gutterBottom>
              {product.title}
            </Typography>

            <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
              <Rating
                value={product.ratings.average}
                precision={0.5}
                readOnly
              />
              <Typography variant='body2' color='text.secondary' sx={{ ml: 1 }}>
                ({product.ratings.count} reviews)
              </Typography>
            </Box>

            <Typography variant='h5' color='primary' sx={{ mb: 3 }}>
              ${selectedVariant?.price || product.variants[0]?.price}
            </Typography>

            <Typography variant='body1' sx={{ mb: 4 }}>
              {product.description}
            </Typography>

            <Divider sx={{ my: 3 }} />

            {/* Color Selection */}
            <FormControl component='fieldset' sx={{ mb: 3 }}>
              <FormLabel component='legend'>Color</FormLabel>
              <RadioGroup
                row
                value={selectedColor}
                onChange={(e) => handleColorChange(e.target.value)}
              >
                {getAvailableColors().map((color) => (
                  <FormControlLabel
                    key={color}
                    value={color}
                    control={<Radio />}
                    label={color}
                  />
                ))}
              </RadioGroup>
            </FormControl>

            {/* Size Selection */}
            <FormControl fullWidth sx={{ mb: 3 }}>
              <InputLabel>Size</InputLabel>
              <Select
                value={selectedSize}
                label='Size'
                onChange={(e) => handleSizeChange(e.target.value)}
              >
                {getAvailableSizes(selectedColor).map((size) => (
                  <MenuItem key={size} value={size}>
                    {size}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>

            {/* Stock Status */}
            {selectedVariant && (
              <Typography
                variant='body2'
                color={
                  selectedVariant.stock > 0 ? 'success.main' : 'error.main'
                }
                sx={{ mb: 3 }}
              >
                {selectedVariant.stock > 0
                  ? `In Stock (${selectedVariant.stock} available)`
                  : 'Out of Stock'}
              </Typography>
            )}

            {/* Action Buttons */}
            <Box sx={{ display: 'flex', gap: 2, mb: 3 }}>
              <Button
                variant='contained'
                size='large'
                startIcon={<ShoppingCartIcon />}
                fullWidth
                disabled={!selectedVariant || selectedVariant.stock === 0}
                onClick={handleAddToCart}
              >
                Add to Cart
              </Button>
              <IconButton
                color={isWishlist ? 'error' : 'default'}
                onClick={() => setIsWishlist(!isWishlist)}
              >
                {isWishlist ? <FavoriteIcon /> : <FavoriteBorderIcon />}
              </IconButton>
            </Box>

            {/* Product Details */}
            <Box sx={{ mt: 4 }}>
              <Typography variant='h6' gutterBottom>
                Product Details
              </Typography>
              <Typography variant='body2' color='text.secondary'>
                Brand: {product.brand}
              </Typography>
              <Typography variant='body2' color='text.secondary'>
                Category: {product.category}
              </Typography>
              {selectedVariant && (
                <Typography variant='body2' color='text.secondary'>
                  SKU: {selectedVariant.sku}
                </Typography>
              )}
            </Box>
          </Paper>
        </Grid>
      </Grid>
    </Container>
  );
}
