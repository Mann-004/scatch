
const mongoose = require('mongoose');

const productSchema = new mongoose.Schema({
    image: Buffer, // You might want to use String if storing image URLs or filenames instead of raw binary
    name: String,
    price: Number,
    discount: {
        type: Number,
        default: 0
    },
    category: {
        type: String,
        required: true,
        enum: ['backpacks', 'luggage', 'duffles']
    }
});

module.exports = mongoose.model('Product', productSchema);
