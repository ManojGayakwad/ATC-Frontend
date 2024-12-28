// routes/beverageRoutes.js
const express = require('express');
const router = express.Router();
const Beverage = require('../models/Beverage');

// Get all beverages
router.get('/', async (req, res) => {
  try {
    const beverages = await Beverage.find();
    res.json(beverages);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Add new beverage
router.post('/', async (req, res) => {
  const beverage = new Beverage(req.body);
  try {
    const newBeverage = await beverage.save();
    res.status(201).json(newBeverage);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

module.exports = router;