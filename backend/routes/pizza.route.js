/*const express = require('express');
const router = express.Router();
const { MongoClient } = require('mongodb');
const { ObjectId } = require('mongodb');


const uri = process.env.MONGODB_URI;
console.log("MongoDB URI:", process.env.MONGODB_URI);
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });

router.get('/', async (req, res) => {
  try {
    await client.connect();
    const pizzas = await client.db('pizzaland').collection('pizzas').find().toArray();
    res.json(pizzas);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching pizzas' });
  }
});


module.exports = router;*/

const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');
const Pizza = require('../models/pizza');

// Get all pizzas
router.get('/', async (req, res) => {
  try {
    const pizzas = await Pizza.find();
    res.json(pizzas);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Create a new pizza
router.post('/', async (req, res) => {
    const { id , name, description, image, priceSm, priceMd, priceLg, toppings } = req.body;
    try {
      const newPizza = await Pizza.create({id , name, description, image, priceSm, priceMd, priceLg, toppings });
      res.status(201).json(newPizza);
    } catch (error) {
      res.status(400).json({ message: error.message });
    }
  });
  // chercher un article
  router.get('/:pizzaId', async (req, res) => {
    try {
      const pizza = await Pizza.findById(req.params.pizzaId);
      if (!pizza) {
        return res.status(404).json({ message: 'Pizza not found' });
      }
      res.status(200).json(pizza);
    } catch (error) {
      res.status(404).json({ message: error.message });
    }
  });
  
  // Delete a pizza by ID
  router.delete('/:pizzaId', async (req, res) => {
    try {
      if (!mongoose.Types.ObjectId.isValid(req.params.pizzaId)) {
        return res.status(400).json({ message: 'Invalid Pizza ID' });
      }
  
      const pizza = await Pizza.findByIdAndDelete(req.params.pizzaId);
      if (!pizza) {
        return res.status(404).json({ message: 'Pizza not found' });
      }
  
      res.json({ message: 'Pizza deleted successfully.' });
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  });
// Update a pizza by ID
router.put('/:pizzaId', async (req, res) => {
  try {
    const pizza = await Pizza.findByIdAndUpdate(
      req.params.pizzaId,
      { $set: req.body },
      { new: true }
    );
    res.status(200).json(pizza);
  } catch (error) {
    res.status(404).json({ message: error.message });
  }
});


// Assuming you have a route to fetch pizzas with price range filtering

// Assuming you have a route for pagination filtering
/*
router.get('/fff/paginationFilter', async (req, res) => {
  const { page, limit, searchTerm, prixMax } = req.query;
  const offset = (page - 1) * limit;
  
  try {
    let query = {};
    // If searchTerm is provided, add a filter for the designation
    if (searchTerm) {
      query.designation = { $regex: new RegExp(searchTerm, 'i') };
    }
    
    // Add a filter for the price
    query.priceSm = { $lte: prixMax };
    
    // Query pizzas collection using pagination parameters
    const pizzas = await Pizza.find(query)
      .sort({ '_id': -1 })
      .skip(offset)
      .limit(parseInt(limit));

    res.status(200).json({ pizzas });
  } catch (error) {
    console.error('Error filtering pizzas:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
});


*/
// Pagination and filter route
router.get('/fff/paginationFilter', async (req, res) => {
  const { page = 1, limit = 5, searchTerm = '', prixMax } = req.query;
  const query = {};

  if (searchTerm) {
    query.name = { $regex: searchTerm, $options: 'i' }; // Case-insensitive search
  }

  if (prixMax) {
    query.priceSm = { $lte: Number(prixMax) };
  }

  try {
    const pizzas = await Pizza.find(query)
      .skip((page - 1) * limit)
      .limit(Number(limit));

    const count = await Pizza.countDocuments(query);

    res.json({ pizzas, totalPages: Math.ceil(count / limit), currentPage: page });
  } catch (error) {
    res.status(500).json({ error: 'Error fetching pizzas' });
  }
});

  
  
  


module.exports = router;
