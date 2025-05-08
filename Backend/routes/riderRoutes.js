const express = require('express');
const router = express.Router();
const Order = require('../models/Order');
const verifyToken = require('../middlewares/authMiddleware');
const roleCheck = require('../middlewares/roleMiddleware');

// Get orders assigned to rider
router.get('/orders', verifyToken, roleCheck('rider'), async (req, res) => {
  const orders = await Order.find({ assignedRider: req.user._id });
  res.json(orders);
});

// Update delivery status
router.patch(
  '/orders/:id',
  verifyToken,
  roleCheck('rider'),
  async (req, res) => {
    const { status } = req.body;
    const order = await Order.findById(req.params.id);

    if (!order || order.assignedRider.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: 'Unauthorized' });
    }

    order.status = status;
    await order.save();
    res.json(order);
  }
);

module.exports = router;
