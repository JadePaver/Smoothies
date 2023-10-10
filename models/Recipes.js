const mongoose = require('mongoose');

const recipeSchema = new mongoose.Schema({
    itemName: {
        type: String,
        required: [true, 'Please enter the item name'],
        unique: true,
        lowercase: true,
    },
    itemContent: {
        type: String,
        required: [true, 'Please include the content'],
    },
    sugar: {
        type: String,
        required: [true, 'Please include the sugar'],
    },
});

const Recipe = mongoose.model('recipe', recipeSchema);

module.exports = Recipe;