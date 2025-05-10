const express = require('express');
const router = express.Router();
const Product = require('../models/Product');
const verifyToken = require('../middlewares/authMiddleware');
const requireRole = require('../middlewares/requireRole');
const { updateStock } = require('../services/productService'); // Path to the productService
const mongoose = require('mongoose');

// GET /products - public
router.get('/', async (req, res) => {
  const products = await Product.find();
  res.json(products);
});

// GET /products/:id - public
router.get('/:id', async (req, res) => {
  const product = await Product.findById(req.params.id);
  if (!product) return res.status(404).json({ message: 'Product not found' });
  res.json(product);
});

// POST /products - admin only
router.post('/', verifyToken, requireRole('admin'), async (req, res) => {
  try {
    console.log(
      '📦 Product Create Payload:',
      JSON.stringify(req.body, null, 2)
    );
    const newProduct = await Product.create(req.body);
    res.status(201).json(newProduct);
  } catch (err) {
    res
      .status(400)
      .json({ message: 'Error creating product', error: err.message });
  }
});

// DELETE /products/:id - admin only
router.delete('/:id', verifyToken, requireRole('admin'), async (req, res) => {
  await Product.findByIdAndDelete(req.params.id);
  res.json({ message: 'Product deleted' });
});

// Endpoint to update stock
router.patch('/update-stock', verifyToken, async (req, res) => {
  const { productId, variantId, additionalStock } = req.body;

  // Ensure productId and variantId are ObjectId types
  if (
    !mongoose.Types.ObjectId.isValid(productId) ||
    !mongoose.Types.ObjectId.isValid(variantId)
  ) {
    return res.status(400).json({ message: 'Invalid product or variant ID' });
  }

  // Validate input data
  if (typeof additionalStock !== 'number') {
    return res.status(400).json({ message: 'Invalid stock value' });
  }

  // Check if the user is an admin
  if (req.user.role !== 'admin') {
    return res.status(403).json({ message: 'Forbidden: Insufficient role' });
  }

  // Call the update stock function
  const result = await updateStock(productId, variantId, additionalStock);

  if (result.message === 'Stock updated successfully') {
    res.status(200).json(result);
  } else {
    res.status(400).json(result);
  }
});

module.exports = router;
