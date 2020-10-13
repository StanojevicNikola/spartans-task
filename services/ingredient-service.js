const Ingredient = require('../models/ingredient');

class IngredientService {

    async insert(data) {
        return Ingredient.create(data);
    }

    async findOne(_id) {
        return Ingredient.findOne({ _id });
    }

    async updateOne(_id, updateObject) {
        return Ingredient.updateOne({ _id }, updateObject);
    }

    async find(query = {}) {
        return Ingredient.find(query).sort('-createdAt');
    }

    async accumulatedTime(ingredients = []) {
        return Ingredient.aggregate
            ([{ $match: { name: { $in: ingredients } } },
            { $group: { _id: null, totalTime: { $sum: "$time" }, totalPrice: { $sum: "$price" } } }])
            .exec()
    }
}

module.exports = IngredientService;