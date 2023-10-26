const mongoose = require('mongoose');

const orderSchema = mongoose.Schema({
  cart_id: String,
  userInfo: {
    fullName: String,
    phone: String,
    address: String
  },
  products: [
    {
      product_id: String,
      price: Number,
      discountPercentage: Number,
      quantity: Number
    }
  ],
  deleted: {
    type: Boolean,
    default: false
  },
  deletedAt: {
    type: Date,
    default: new Date()
  }
}, {
  timestamps: true
})

const Order = mongoose.model("Order", orderSchema, "orders");

module.exports = Order;