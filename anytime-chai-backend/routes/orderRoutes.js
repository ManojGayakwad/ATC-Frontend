const express = require('express');
const mongoose = require("mongoose");
const router = express.Router();
const Order = require('../models/Order');
const Resource = require('../models/Resource');
const Beverage = require('../models/Beverage');

// Function to check resource sufficiency
const checkResources = (ingredients, resources) => {
  for (const [ingredient, requiredAmount] of Object.entries(ingredients)) {
    const resource = resources.find(
      (res) => res.name.toLowerCase() === ingredient.toLowerCase()
    );

    if (!resource || resource.amount < requiredAmount) {
      return false; // Not enough resource or resource not found
    }
  }
  return true; // All resources are sufficient
};

// Function to update resources after creating an order
const updateResources = async (ingredients, resources, session) => {
  for (const [ingredient, requiredAmount] of Object.entries(ingredients)) {
    const resource = resources.find(
      (res) => res.name.toLowerCase() === ingredient.toLowerCase()
    );

    if (resource) {
      resource.amount -= requiredAmount; // Deduct the required amount

      if (resource.amount < 0) {
        throw new Error(`Insufficient ${ingredient} resource during update.`);
      }

      // Update the resource in the database
      await Resource.updateOne(
        { _id: resource._id },
        { $set: { amount: resource.amount } },
        { session }
      );
    }
  }
};

// Function to update order status after a timeout
const updateOrderStatus = async (orderId) => {
  try {
    // Simulate a delay before updating the status
    await new Promise((resolve) => setTimeout(resolve, 3000));

    // Update the status to "completed"
    await Order.updateOne(
      { _id: orderId },
      { $set: { status: "completed" } }
    );

    console.log(`Order ${orderId} status updated to completed.`);
  } catch (err) {
    console.error(`Failed to update status for order ${orderId}:`, err);
  }
};

// Create new order
router.post('/', async (req, res) => {
  const session = await mongoose.startSession();
  session.startTransaction();

  try {
    const { beverageId, amount, paymentMethod } = req.body;
    const beverage = await Beverage.findById(beverageId);

    // Check resources
    const resources = await Resource.find();
    const sufficient = checkResources(beverage.ingredients, resources);

    if (!sufficient) {
      throw new Error('Insufficient resources');
    }

    // Create order
    const order = new Order({
      beverage: beverageId,
      amount,
      paymentMethod,
      status: "pending", // Set initial status to pending
    });

    await order.save({ session });

    // Update resources
    await updateResources(beverage.ingredients, resources, session);

    await session.commitTransaction();

    // Start async status update
    updateOrderStatus(order._id);

    res.status(201).json(order);
  } catch (err) {
    await session.abortTransaction();
    res.status(400).json({ message: err.message });
  } finally {
    session.endSession();
  }
});


router.patch('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const { status } = req.body;
    const order = await Order.findByIdAndUpdate(id, { status }, { new: true });
    if (!order) return res.status(404).send("Order not found");
    res.json(order);
  } catch (err) {
    res.status(500).send("Server error");
  }
});

module.exports = router;
