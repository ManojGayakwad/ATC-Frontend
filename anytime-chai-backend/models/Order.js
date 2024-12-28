// models/Order.js
const mongoose = require('mongoose');

const orderSchema = new mongoose.Schema({
  beverage: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Beverage',
    required: true
  },
  amount: {
    type: Number,
    required: true
  },
  status: {
    type: String,
    enum: ['pending', 'completed', 'failed'],
    default: 'pending'
  },
  paymentMethod: {
    type: String,
    enum: ['cash', 'upi'],
    required: true
  },
  timestamp: {
    type: Date,
    default: Date.now
  }
});

module.exports = mongoose.model('Order', orderSchema);

