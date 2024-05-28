/*const express = require('express');
const router = express.Router();
const { MongoClient } = require('mongodb');
const { ObjectId } = require('mongodb');

const uri = process.env.MONGODB_URI;
console.log("MongoDB URI:", process.env.MONGODB_URI);
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });

router.post('/', async (req, res) => {
  try {
    await client.connect();
    const { id, image, name, price, additionalTopping, size, crust, amount } = req.body;
    const result = await client.db('pizzaland').collection('cart').insertOne({ id, image, name, price, additionalTopping, size, crust, amount });
    res.json(result.ops[0]);
  } catch (error) {
    res.status(500).json({ message: 'Error adding to cart' });
  }
});

router.get('/', async (req, res) => {
  try {
    await client.connect();
    const cart = await client.db('pizzaland').collection('cart').find().toArray();
    res.json(cart);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching cart' });
  }
});

router.delete('/:id', async (req, res) => {
  try {
    await client.connect();
    const { id } = req.params;
    await client.db('pizzaland').collection('cart').deleteOne({ _id: new ObjectId(id) });
    res.sendStatus(200);
  } catch (error) {
    res.status(500).json({ message: 'Error deleting from cart' });
  }
});

router.put('/:id', async (req, res) => {
  try {
    await client.connect();
    const { id } = req.params;
    const { operation } = req.body;
    const cartItem = await client.db('pizzaland').collection('cart').findOne({ _id: new ObjectId(id) });
    if (!cartItem) {
      return res.status(404).json({ message: 'Cart item not found' });
    }
    if (operation === 'increase') {
      await client.db('pizzaland').collection('cart').updateOne({ _id: new ObjectId(id) }, { $inc: { amount: 1 } });
    } else if (operation === 'decrease') {
      await client.db('pizzaland').collection('cart').updateOne({ _id: new ObjectId(id) }, { $inc: { amount: -1 } });
    }
    res.sendStatus(200);
  } catch (error) {
    res.status(500).json({ message: 'Error updating cart' });
  }
});

module.exports = router;*/
const express = require('express');
const router = express.Router();
const CartItem = require('../models/cart');

// Get all cart items
router.get('/', async (req, res) => {
  try {
    const cartItems = await CartItem.find();
    res.json(cartItems);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Add an item to the cart
router.post('/', async (req, res) => {
  const cartItem = new CartItem({
    productId: req.body.productId,
    quantity: req.body.quantity,
    // Add other fields as needed
  });

  try {
    const newCartItem = await cartItem.save();
    res.status(201).json(newCartItem);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

// Update a cart item's quantity
router.patch('/:id', getCartItem, async (req, res) => {
  if (req.body.quantity != null) {
    res.cartItem.quantity = req.body.quantity;
  }
  // Add other fields as needed

  try {
    const updatedCartItem = await res.cartItem.save();
    res.json(updatedCartItem);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

// Delete a cart item
router.delete('/:id', getCartItem, async (req, res) => {
  try {
    await res.cartItem.remove();
    res.json({ message: 'Deleted cart item' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Middleware to get a specific cart item by ID
async function getCartItem(req, res, next) {
  let cartItem;
  try {
    cartItem = await CartItem.findById(req.params.id);
    if (cartItem == null) {
      return res.status(404).json({ message: 'Cannot find cart item' });
    }
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }

  res.cartItem = cartItem;
  next();
}

module.exports = router;
