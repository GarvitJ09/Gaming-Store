const mongoose = require('mongoose');

const orderItemSchema = new mongoose.Schema({
  productId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Product',
    required: true,
  },
  variant: {
    color: { type: String, required: true },
    size: { type: String, required: true },
  },
  quantity: { type: Number, required: true },
  price: { type: Number, required: true },
});

const orderSchema = new mongoose.Schema(
  {
    user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    items: [orderItemSchema],
    totalPrice: { type: Number, required: true },
    customerDetails: {
      name: { type: String, required: true },
      phone: { type: String, required: true },
      address: { type: String, required: true },
    },
    paymentMethod: { type: String, required: true }, // e.g., 'credit_card', 'paypal', 'cash_on_delivery'
    status: { 
      type: String, 
      enum: ['Pending', 'Paid', 'Processing', 'Shipped', 'Delivered', 'Cancelled'],
      default: 'Pending' 
    },
    assignedRider: { 
      type: mongoose.Schema.Types.ObjectId, 
      ref: 'User',
      default: null 
    }
  },
  { timestamps: true }
);

module.exports = mongoose.model('Order', orderSchema);
