// models/Resource.js
const mongoose = require('mongoose');

const resourceSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    unique: true
  },
  amount: {
    type: Number,
    required: true
  },
  unit: {
    type: String,
    required: true
  },
  threshold: {
    type: Number,
    required: true
  }
});

module.exports = mongoose.model('Resource', resourceSchema);