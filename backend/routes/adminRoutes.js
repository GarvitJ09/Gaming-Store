const express = require('express');
const router = express.Router();
const Order = require('../models/Order');
const User = require('../models/User');
const authenticateFirebaseToken = require('../middlewares/authMiddleware');
const { isAdmin } = require('../middlewares/authMiddleware');
const admin = require('../config/firebase');

/**
 * Get all orders
 */
router.get('/orders', authenticateFirebaseToken, isAdmin, async (req, res) => {
  try {
    const orders = await Order.find()
      .populate('user', 'name email') // Populate user details
      .populate('assignedRider', 'name email') // Populate rider details
      .sort({ createdAt: -1 }); // Most recent first

    res.json({ orders });
  } catch (error) {
    console.error('Error fetching orders:', error);
    res.status(500).json({
      message: 'Failed to fetch orders',
      error: error.message,
      code: 'admin/fetch-orders-failed',
    });
  }
});

/**
 * Update order status and assign a rider
 */
router.patch(
  '/orders/:id',
  authenticateFirebaseToken,
  isAdmin,
  async (req, res) => {
    try {
      const { status, riderId } = req.body;
      const { id } = req.params;

      if (
        status &&
        ![
          'Pending',
          'Paid',
          'Processing',
          'Shipped',
          'Delivered',
          'Cancelled',
        ].includes(status)
      ) {
        return res.status(400).json({
          message: 'Invalid status',
          code: 'admin/invalid-status',
        });
      }

      const order = await Order.findById(id);
      if (!order) {
        return res.status(404).json({
          message: 'Order not found',
          code: 'admin/order-not-found',
        });
      }

      if (status) order.status = status;
      if (riderId) {
        const rider = await User.findOne({ _id: riderId, role: 'rider' });
        if (!rider) {
          return res.status(404).json({
            message: 'Rider not found',
            code: 'admin/rider-not-found',
          });
        }
        order.assignedRider = riderId;
      }

      await order.save();
      const updatedOrder = await Order.findById(id)
        .populate('user', 'name email')
        .populate('assignedRider', 'name email');

      res.json({
        message: 'Order updated successfully',
        order: updatedOrder,
      });
    } catch (error) {
      console.error('Error updating order:', error);
      res.status(500).json({
        message: 'Failed to update order',
        error: error.message,
        code: 'admin/update-order-failed',
      });
    }
  }
);

/**
 * Get all riders
 */
router.get('/riders', authenticateFirebaseToken, isAdmin, async (req, res) => {
  try {
    const riders = await User.find({ role: 'rider' }).sort({ name: 1 });

    // Get assigned orders count for each rider
    const ridersWithOrderCount = await Promise.all(
      riders.map(async (rider) => {
        const assignedOrders = await Order.countDocuments({
          assignedRider: rider._id,
        });
        return {
          ...rider.toObject(),
          assignedOrders,
        };
      })
    );

    res.json({ riders: ridersWithOrderCount });
  } catch (error) {
    console.error('Error fetching riders:', error);
    res.status(500).json({
      message: 'Failed to fetch riders',
      error: error.message,
      code: 'admin/fetch-riders-failed',
    });
  }
});

/**
 * Add a new rider
 */
router.post('/riders', authenticateFirebaseToken, isAdmin, async (req, res) => {
  try {
    const { name, email, phone, password } = req.body;

    if (!name || !email || !phone || !password) {
      return res.status(400).json({
        message: 'All fields are required',
        code: 'admin/missing-fields',
      });
    }

    // Check if user already exists
    let user = await User.findOne({ email });
    if (user) {
      return res.status(409).json({
        message: 'User already exists',
        code: 'admin/user-exists',
      });
    }

    // Create user in Firebase
    const userRecord = await admin.auth().createUser({
      email,
      password,
      displayName: name,
    });

    // Create new user in MongoDB with rider role
    user = new User({
      firebaseUid: userRecord.uid,
      name,
      email,
      phone,
      role: 'rider',
      address: '',
    });

    await user.save();

    res.status(201).json({
      message: 'Rider created successfully',
      rider: {
        ...user.toObject(),
        password: undefined,
      },
    });
  } catch (error) {
    console.error('Error creating rider:', error);
    res.status(500).json({
      message: 'Failed to create rider',
      error: error.message,
      code: 'admin/create-rider-failed',
    });
  }
});

/**
 * Update a rider
 */
router.put(
  '/riders/:id',
  authenticateFirebaseToken,
  isAdmin,
  async (req, res) => {
    try {
      const { id } = req.params;
      const { name, phone, address } = req.body;

      const rider = await User.findOneAndUpdate(
        { _id: id, role: 'rider' },
        { name, phone, address },
        { new: true }
      );

      if (!rider) {
        return res.status(404).json({
          message: 'Rider not found',
          code: 'admin/rider-not-found',
        });
      }

      res.json({
        message: 'Rider updated successfully',
        rider: {
          ...rider.toObject(),
          password: undefined,
        },
      });
    } catch (error) {
      console.error('Error updating rider:', error);
      res.status(500).json({
        message: 'Failed to update rider',
        error: error.message,
        code: 'admin/update-rider-failed',
      });
    }
  }
);

/**
 * Delete a rider
 */
router.delete(
  '/riders/:id',
  authenticateFirebaseToken,
  isAdmin,
  async (req, res) => {
    try {
      const { id } = req.params;

      const rider = await User.findOne({ _id: id, role: 'rider' });
      if (!rider) {
        return res.status(404).json({
          message: 'Rider not found',
          code: 'admin/rider-not-found',
        });
      }

      // Delete from Firebase
      await admin.auth().deleteUser(rider.firebaseUid);

      // Delete from MongoDB
      await User.deleteOne({ _id: id });

      res.json({
        message: 'Rider deleted successfully',
      });
    } catch (error) {
      console.error('Error deleting rider:', error);
      res.status(500).json({
        message: 'Failed to delete rider',
        error: error.message,
        code: 'admin/delete-rider-failed',
      });
    }
  }
);

/**
 * Get orders assigned to a specific rider
 */
router.get(
  '/riders/:id/orders',
  authenticateFirebaseToken,
  isAdmin,
  async (req, res) => {
    try {
      const { id } = req.params;

      // Verify rider exists
      const rider = await User.findOne({ _id: id, role: 'rider' });
      if (!rider) {
        return res.status(404).json({
          message: 'Rider not found',
          code: 'admin/rider-not-found',
        });
      }

      const orders = await Order.find({ assignedRider: id })
        .populate('user', 'name email')
        .sort({ createdAt: -1 });

      res.json({ orders });
    } catch (error) {
      console.error('Error fetching rider orders:', error);
      res.status(500).json({
        message: 'Failed to fetch rider orders',
        error: error.message,
        code: 'admin/fetch-rider-orders-failed',
      });
    }
  }
);

module.exports = router;
