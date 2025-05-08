const express = require('express');
const router = express.Router();
const Cart = require('../models/Cart');
const Product = require('../models/Product');
const verifyToken = require('../middlewares/authMiddleware');

// Add or update an item in the cart
router.post('/add', verifyToken, async (req, res) => {
  const { productId, variant, quantity } = req.body;

  try {
    const product = await Product.findById(productId);
    if (!product) return res.status(404).json({ message: 'Product not found' });

    const selectedVariant = product.variants.find(
      (v) => v.color === variant.color && v.size === variant.size
    );
    if (!selectedVariant)
      return res.status(404).json({ message: 'Variant not found' });

    if (selectedVariant.stock < quantity) {
      return res
        .status(400)
        .json({ message: 'Insufficient stock for this variant' });
    }

    selectedVariant.stock -= quantity;
    await product.save();

    let cart = await Cart.findOne({ user: req.user._id });
    if (!cart) {
      cart = new Cart({ user: req.user._id, items: [] });
    }

    const existingItem = cart.items.find(
      (item) =>
        item.product.toString() === productId &&
        item.variant.color === variant.color &&
        item.variant.size === variant.size
    );

    if (existingItem) {
      existingItem.quantity = quantity; // Update quantity
      existingItem.price = selectedVariant.price; // Update price in case it changes
    } else {
      cart.items.push({
        product: productId,
        variant,
        price: selectedVariant.price, // Add the price of the selected variant
        quantity,
      });
    }

    await cart.save();

    const populatedCart = await Cart.findOne({ user: req.user._id }).populate(
      'items.product'
    );
    res.status(200).json(populatedCart);
  } catch (error) {
    console.error('Error in /add route:', error);
    res.status(500).json({ message: 'Failed to add product to cart', error });
  }
});

// Fetch the cart for the authenticated user
router.get('/', verifyToken, async (req, res) => {
  try {
    const cart = await Cart.findOne({ user: req.user._id }).populate(
      'items.product'
    );
    if (!cart) {
      return res.status(200).json({ items: [] }); // Return an empty cart if none exists
    }

    // Add price from the selected variant to each cart item
    cart.items = cart.items.map((item) => {
      const selectedVariant = item.product.variants.find(
        (v) => v.color === item.variant.color && v.size === item.variant.size
      );
      return {
        ...item.toObject(),
        price: selectedVariant ? selectedVariant.price : 0, // Include price
      };
    });

    res.status(200).json(cart);
  } catch (error) {
    console.error('Error fetching cart:', error);
    res.status(500).json({ message: 'Failed to fetch cart' });
  }
});

// Get total count of items in the cart
router.get('/count', verifyToken, async (req, res) => {
  try {
    const cart = await Cart.findOne({ user: req.user._id });
    if (!cart) {
      return res.status(200).json({ count: 0 }); // Return 0 if no cart exists
    }

    const totalCount = cart.items.reduce((sum, item) => sum + item.quantity, 0);
    res.status(200).json({ count: totalCount });
  } catch (error) {
    console.error('Error fetching cart items count:', error);
    res.status(500).json({ message: 'Failed to fetch cart items count' });
  }
});

// Remove product from cart
router.delete('/remove/:productId', verifyToken, async (req, res) => {
  const { productId } = req.params;
  const { variant } = req.body;

  try {
    const cart = await Cart.findOne({ user: req.user._id });
    if (!cart) {
      return res.status(404).json({ message: 'Cart not found' });
    }

    // Find the item to remove
    const itemIndex = cart.items.findIndex(
      (item) =>
        item.product.toString() === productId &&
        item.variant.color === variant.color &&
        item.variant.size === variant.size
    );

    if (itemIndex === -1) {
      return res.status(404).json({ message: 'Item not found in cart' });
    }

    // Remove the item from the cart
    cart.items.splice(itemIndex, 1);
    await cart.save();

    res.status(200).json({ items: cart.items });
  } catch (error) {
    console.error('Error removing item from cart:', error);
    res.status(500).json({ message: 'Failed to remove item from cart' });
  }
});

// Clear all items from the cart
router.delete('/clear', verifyToken, async (req, res) => {
  try {
    const cart = await Cart.findOne({ user: req.user._id });
    if (!cart) {
      return res.status(404).json({ message: 'Cart not found' });
    }

    cart.items = []; // Clear all items from the cart
    await cart.save();

    res.status(200).json({ message: 'Cart cleared successfully' });
  } catch (error) {
    console.error('Error clearing cart:', error);
    res.status(500).json({ message: 'Failed to clear cart' });
  }
});

module.exports = router;
