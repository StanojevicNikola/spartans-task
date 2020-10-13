const mongoose = require('mongoose');

const ingredientSchema = new mongoose.Schema({
    name: {
        type: String,
    },
    time: {
        type: Number,
    },
    price: {
        type: Number,
    },
    createdAt: {
        type: Date,
        default: Date.now
    }
});

const Ingredient = mongoose.model('Ingredient', ingredientSchema);
module.exports = Ingredient;