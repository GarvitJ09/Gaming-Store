const express = require('express');
const router = express.Router();
const authenticateFirebaseToken = require('../middlewares/authMiddleware');
const { isAdmin } = require('../middlewares/authMiddleware');
const Order = require('../models/Order');

/**
 * Create a new order
 */
router.post('/', authenticateFirebaseToken, async (req, res) => {
  try {
    const { items, total, userDetails, paymentMethod } = req.body;

    const order = new Order({
      user: req.user._id,
      items,
      totalPrice: total,
      customerDetails: userDetails,
      paymentMethod,
      status: paymentMethod === 'cash_on_delivery' ? 'Pending' : 'Paid',
    });

    await order.save();
    res.status(201).json({
      message: 'Order created successfully',
      order: {
        ...order.toObject(),
        user: undefined // Don't send user details in response
      }
    });
  } catch (error) {
    console.error('Error creating order:', error);
    res.status(500).json({ 
      message: 'Failed to create order',
      error: error.message,
      code: 'order/create-failed'
    });
  }
});

/**
 * Get authenticated user's orders
 */
router.get('/', authenticateFirebaseToken, async (req, res) => {
  try {
    const orders = await Order.find({ user: req.user._id })
      .populate('items.productId')
      .sort({ createdAt: -1 }); // Most recent first

    res.json({
      orders: orders.map(order => ({
        ...order.toObject(),
        user: undefined // Don't send user details in response
      }))
    });
  } catch (error) {
    console.error('Error fetching orders:', error);
    res.status(500).json({ 
      message: 'Failed to fetch orders',
      error: error.message,
      code: 'order/fetch-failed'
    });
  }
});

/**
 * Get all orders (admin only)
 */
router.get('/all', authenticateFirebaseToken, isAdmin, async (req, res) => {
  try {
    const orders = await Order.find()
      .populate('user', 'name email')
      .sort({ createdAt: -1 }); // Most recent first

    res.json({ orders });
  } catch (error) {
    console.error('Error fetching all orders:', error);
    res.status(500).json({ 
      message: 'Failed to fetch orders',
      error: error.message,
      code: 'order/fetch-all-failed'
    });
  }
});

/**
 * Update order status (admin only)
 */
router.put('/:orderId/status', authenticateFirebaseToken, isAdmin, async (req, res) => {
  try {
    const { orderId } = req.params;
    const { status } = req.body;

    if (!status || !['Pending', 'Processing', 'Shipped', 'Delivered', 'Cancelled'].includes(status)) {
      return res.status(400).json({
        message: 'Invalid status',
        code: 'order/invalid-status'
      });
    }

    const order = await Order.findByIdAndUpdate(
      orderId,
      { status },
      { new: true }
    ).populate('user', 'name email');

    if (!order) {
      return res.status(404).json({
        message: 'Order not found',
        code: 'order/not-found'
      });
    }

    res.json({ order });
  } catch (error) {
    console.error('Error updating order status:', error);
    res.status(500).json({ 
      message: 'Failed to update order status',
      error: error.message,
      code: 'order/update-status-failed'
    });
  }
});

/**
 * Get order details
 */
router.get('/:orderId', authenticateFirebaseToken, async (req, res) => {
  try {
    const { orderId } = req.params;
    const order = await Order.findById(orderId)
      .populate('items.productId')
      .populate('user', 'name email');

    if (!order) {
      return res.status(404).json({
        message: 'Order not found',
        code: 'order/not-found'
      });
    }

    // Check if user is admin or the order owner
    if (req.user.role !== 'admin' && order.user._id.toString() !== req.user._id.toString()) {
      return res.status(403).json({
        message: 'Access denied',
        code: 'order/access-denied'
      });
    }

    res.json({ order });
  } catch (error) {
    console.error('Error fetching order details:', error);
    res.status(500).json({ 
      message: 'Failed to fetch order details',
      error: error.message,
      code: 'order/fetch-details-failed'
    });
  }
});

module.exports = router;
