const mongoose = require('mongoose');
const generateHelper = require('../helpers/generate');

const userSchema = new mongoose.Schema({
  fullName: String,
  email: String,
  password: String,
  tokenUser: {
    type: String,
    default: generateHelper.generateRandomString(20)
  },
  phone: String,
  avatar: String,
  status: {
    type: String,
    default: "active"
  },
  deleted: {
    type: Boolean,
    default: false
  },
  deletedBy: {
    account_id: String,
    deletedAt: Date
  },
  updatedBy: [{
    account_id: String,
    updatedAt: Date
  }],
  deleteAt: Date,
},
  {
    timestamps: true
  }
);

const User = mongoose.model("User", userSchema, "users");

module.exports = User;