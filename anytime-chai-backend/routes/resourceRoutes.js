// routes/resourceRoutes.js
const express = require('express');
const router = express.Router();
const Resource = require('../models/Resource');

// Get all resources
router.get('/', async (req, res) => {
  try {
    const resources = await Resource.find();
    res.json(resources);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Update resource
router.patch('/:id', async (req, res) => {
  try {
    const resource = await Resource.findById(req.params.id);
    if (req.body.amount) {
      resource.amount = req.body.amount;
    }
    const updatedResource = await resource.save();
    res.json(updatedResource);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

router.post('/', async (req, res) => {
    try {
      if (Array.isArray(req.body)) {
        const resources = await Resource.insertMany(req.body);
        res.status(201).json(resources);
      } else {
        const resource = new Resource(req.body);
        await resource.save();
        res.status(201).json(resource);
      }
    } catch (err) {
      res.status(400).json({ error: err.message });
    }
  });
  
module.exports = router;