import React, { useEffect, useState } from 'react';
import {
  Box,
  TextField,
  Button,
  Typography,
  Grid,
  Paper,
  Divider,
  Checkbox,
  FormControlLabel,
} from '@mui/material';
import { productService } from '../../services/productService';
import { storage } from '../../firebase.js';
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';

const AdminProductManagement = () => {
  const [image, setImage] = useState(null);
  const [product, setProduct] = useState({
    title: '',
    description: '',
    category: '',
    brand: '',
    isFeatured: false,
    variants: [],
  });
  const [variant, setVariant] = useState({
    color: '',
    size: '',
    stock: '',
    price: '',
    sku: '',
    image: '',
  });
  const [products, setProducts] = useState([]);

  useEffect(() => {
    fetchProducts();
  }, []);

  const fetchProducts = async () => {
    try {
      const data = await productService.getAllProducts();
      setProducts(data);
    } catch (error) {
      console.error('Error fetching products:', error);
    }
  };

  const handleAddVariant = async () => {
    if (variant.stock && variant.price) {
      let downloadURL = '';

      if (image) {
        const imageRef = ref(storage, `images/${image.name}`);
        try {
          await uploadBytes(imageRef, image);
          downloadURL = await getDownloadURL(imageRef);
          console.log('Image uploaded successfully! URL:', downloadURL);
          alert('Image uploaded successfully!');
        } catch (error) {
          console.error('Error uploading image:', error);
          alert('Image upload failed');
          return;
        }
      }

      // Construct the variant manually
      const newVariant = {
        ...variant,
        image: downloadURL,
      };

      setProduct((prevProduct) => ({
        ...prevProduct,
        variants: [...prevProduct.variants, newVariant],
      }));

      // Clear fields
      setVariant({
        color: '',
        size: '',
        stock: '',
        price: '',
        sku: '',
        image: '',
      });
      setImage('');
    }
  };

  const handleAddProduct = async () => {
    try {
      const newProduct = { ...product };
      console.log(newProduct);
      await productService.addProduct(newProduct);
      alert('Product added successfully!');
    } catch (error) {
      console.error('Error adding product:', error);
      alert('Failed to add product.');
    }
    setProduct({
      title: '',
      description: '',
      category: '',
      brand: '',
      isFeatured: false,
      variants: [],
    });
    fetchProducts();
  };

  const handleUpdateStock = async (productId, variantId, additionalStock) => {
    try {
      await productService.updateVariantStock(
        productId,
        variantId,
        additionalStock
      );
      alert('Stock updated!');
      fetchProducts();
    } catch (error) {
      console.error('Error updating stock:', error);
      alert('Failed to update stock.');
    }
  };

  const handleImageChange = (event) => {
    if (event.target.files[0]) {
      setImage(event.target.files[0]);
    }
  };

  return (
    <Box sx={{ p: 4 }}>
      <Typography variant='h4' gutterBottom>
        Admin Product Management
      </Typography>

      {/* Add New Product */}
      <Paper sx={{ p: 3, mb: 4 }}>
        <Typography variant='h6' gutterBottom>
          Add New Product
        </Typography>
        <TextField
          label='Product Title'
          fullWidth
          value={product.title}
          onChange={(e) => setProduct({ ...product, title: e.target.value })}
          sx={{ mb: 2 }}
        />
        <TextField
          label='Description'
          fullWidth
          multiline
          rows={4}
          value={product.description}
          onChange={(e) =>
            setProduct({ ...product, description: e.target.value })
          }
          sx={{ mb: 2 }}
        />
        <TextField
          label='Category'
          fullWidth
          value={product.category}
          onChange={(e) => setProduct({ ...product, category: e.target.value })}
          sx={{ mb: 2 }}
        />
        <TextField
          label='Brand'
          fullWidth
          value={product.brand}
          onChange={(e) => setProduct({ ...product, brand: e.target.value })}
          sx={{ mb: 2 }}
        />
        <FormControlLabel
          control={
            <Checkbox
              checked={product.isFeatured}
              onChange={(e) =>
                setProduct({ ...product, isFeatured: e.target.checked })
              }
            />
          }
          label='Is Featured?'
        />

        <Typography variant='h6' gutterBottom>
          Add Variants
        </Typography>
        <Grid container spacing={2}>
          <Grid item xs={3}>
            <TextField
              label='Color'
              fullWidth
              value={variant.color}
              onChange={(e) =>
                setVariant({ ...variant, color: e.target.value })
              }
            />
          </Grid>
          <Grid item xs={3}>
            <TextField
              label='Size'
              fullWidth
              value={variant.size}
              onChange={(e) => setVariant({ ...variant, size: e.target.value })}
            />
          </Grid>
          <Grid item xs={2}>
            <TextField
              label='Stock'
              type='number'
              fullWidth
              value={variant.stock}
              onChange={(e) =>
                setVariant({ ...variant, stock: e.target.value })
              }
            />
          </Grid>
          <Grid item xs={2}>
            <TextField
              label='Price'
              type='number'
              fullWidth
              value={variant.price}
              onChange={(e) =>
                setVariant({ ...variant, price: e.target.value })
              }
            />
          </Grid>
          <Grid item xs={2}>
            <TextField
              label='SKU'
              fullWidth
              value={variant.sku}
              onChange={(e) => setVariant({ ...variant, sku: e.target.value })}
            />
          </Grid>
          <Grid item xs={3}>
            <TextField
              input
              type='file'
              multiple
              accept='image/*'
              onChange={handleImageChange}
            />
          </Grid>
        </Grid>
        <Button variant='outlined' onClick={handleAddVariant} sx={{ mt: 2 }}>
          Add Variant
        </Button>

        <Box sx={{ mt: 3 }}>
          <Typography variant='subtitle1'>Variants:</Typography>
          {product.variants.map((v, index) => (
            <Typography key={index}>
              {v.color} - {v.size} - {v.stock} in stock - ₹{v.price} - SKU:{' '}
              {v.sku}
            </Typography>
          ))}
        </Box>
      </Paper>

      <Button variant='contained' color='primary' onClick={handleAddProduct}>
        Save Product
      </Button>

      {/* Existing Products */}
      <Paper sx={{ p: 3, mt: 5 }}>
        <Typography variant='h6' gutterBottom>
          Existing Products
        </Typography>

        {products.map((prod) => (
          <Box key={prod._id} sx={{ mb: 4 }}>
            <Typography variant='subtitle1'>
              {prod.title} - {prod.brand}
            </Typography>
            <Typography variant='body2' sx={{ mb: 1 }}>
              Variants:
            </Typography>

            {prod.variants.map((v, i) => (
              <Box
                key={v._id || i}
                sx={{
                  pl: 2,
                  display: 'flex',
                  alignItems: 'center',
                  gap: 2,
                  mb: 1,
                }}
              >
                <Typography sx={{ flex: 1 }}>
                  Color: {v.color}, Size: {v.size}, Stock: {v.stock}, Price: ₹
                  {v.price}, SKU: {v.sku}
                </Typography>
                <TextField
                  size='small'
                  label='New Stock'
                  type='number'
                  onChange={(e) => {
                    const updated = [...products];
                    const target = updated.find((p) => p._id === prod._id);
                    target.variants[i].additionalStock = e.target.value;
                    setProducts(updated);
                  }}
                />
                <Button
                  size='small'
                  variant='contained'
                  onClick={() =>
                    handleUpdateStock(
                      prod._id,
                      v._id || i,
                      Number(v.additionalStock)
                    )
                  }
                >
                  Update
                </Button>
              </Box>
            ))}

            <Divider sx={{ my: 2 }} />
          </Box>
        ))}
      </Paper>
    </Box>
  );
};

export default AdminProductManagement;
