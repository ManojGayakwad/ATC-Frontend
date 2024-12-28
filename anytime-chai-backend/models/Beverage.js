// models/Beverage.js
const mongoose = require('mongoose');

const beverageSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    unique: true
  },
  ingredients: {
    water: { type: Number, required: true },
    milk: { type: Number, default: 0 },
    coffee: { type: Number, default: 0 },
    tea: { type: Number, default: 0 }
  },
  cost: {
    type: Number,
    required: true
  },
  available: {
    type: Boolean,
    default: true
  }
});

module.exports = mongoose.model('Beverage', beverageSchema);

