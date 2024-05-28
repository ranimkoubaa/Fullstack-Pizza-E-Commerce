/*const { Schema, model } = require('mongoose');

const pizzaSchema = new Schema({
  id: String,
  image: String,
  name: String,
  price: Number,
  additionalTopping: [
    {
      name: String,
      price: Number
    }
  ],
  size: String,
  crust: String
});

module.exports = model('Pizza', pizzaSchema);*/
const mongoose = require('mongoose');

const pizzaSchema = new mongoose.Schema({
  id: Number ,
  name: String,
  description: String,
  image: String,
  priceSm: Number,
  priceMd: Number,
  priceLg: Number,
  toppings: [{
    image: String,
    name: String,
    price: Number
  }]
});



module.exports = mongoose.model('Pizza', pizzaSchema);

