const mongoose = require('mongoose');

const orderSchema = new mongoose.Schema({
  orderNumber: String,
  customerName: String,
  items: [
    {
      productName: String,
      qty: Number,
      price: Number,
    },
  ],
  totalAmount: Number, // hasil qty*price
  status: {
    type: String,
    enum: ['pending', 'paid', 'shipped', 'cancelled'],
    default: 'pending',
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

module.exports = mongoose.model('Order', orderSchema);
