/*const express = require('express');
const router = express.Router();

const mongoose = require('mongoose');
const Order = require('../models/order');
// Sample data for orders
let orders = [];

// GET all orders
router.get('/', (req, res) => {
  res.json(orders);
});

// GET a specific order by ID
router.get('/:id', (req, res) => {
  const orderId = req.params.id;
  const order = orders.find(order => order.id === orderId);
  if (!order) {
    res.status(404).json({ message: 'Order not found' });
  } else {
    res.json(order);
  }
});

// POST a new order
router.post('/', (req, res) => {
  const newOrder = req.body;
  orders.push(newOrder);
  res.status(201).json(newOrder);
});

// PUT (update) an existing order
router.put('/:id', (req, res) => {
  const orderId = req.params.id;
  const updatedOrder = req.body;
  const index = orders.findIndex(order => order.id === orderId);
  if (index === -1) {
    res.status(404).json({ message: 'Order not found' });
  } else {
    orders[index] = updatedOrder;
    res.json(updatedOrder);
  }
});

// DELETE an order
router.delete('/:id', (req, res) => {
  const orderId = req.params.id;
  orders = orders.filter(order => order.id !== orderId);
  res.json({ message: 'Order deleted successfully' });
});

module.exports = router;
*/
const express = require('express');
const router = express.Router();
const Order = require('../models/order');

// GET all orders
router.get('/', async (req, res) => {
  try {
    const orders = await Order.find();
    res.json(orders);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// GET a specific order by ID
router.get('/:id', async (req, res) => {
  try {
    const order = await Order.findById(req.params.id);
    if (!order) {
      return res.status(404).json({ message: 'Order not found' });
    }
    res.json(order);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// POST a new order
router.post('/', async (req, res) => {
  try {
    const newOrder = await Order.create(req.body);
    res.status(201).json(newOrder);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

// PUT (update) an existing order
router.put('/:id', async (req, res) => {
  try {
    const updatedOrder = await Order.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!updatedOrder) {
      return res.status(404).json({ message: 'Order not found' });
    }
    res.json(updatedOrder);
  } catch (error) {
    res.status(404).json({ message: error.message });
  }
});

// DELETE an order
router.delete('/:id', async (req, res) => {
  try {
    const deletedOrder = await Order.findByIdAndDelete(req.params.id);
    if (!deletedOrder) {
      return res.status(404).json({ message: 'Order not found' });
    }
    res.json({ message: 'Order deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

module.exports = router;
