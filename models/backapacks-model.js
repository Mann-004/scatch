const mongoose = require('mongoose');

const backpackSchema = new mongoose.Schema({
  name: String,
  price: Number,
  discount: Number,
  image: String,
});

module.exports = mongoose.model('Backpack', backpackSchema);
