const {Schema, model } = require('mongoose');

const cartSchema = new Schema({
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
  crust: String,
  amount: Number
});

module.exports = model('Cart', cartSchema);