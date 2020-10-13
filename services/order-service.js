const Order = require('../models/order');

class OrderService {

    async insert(data) {
        return Order.create(data);
    }

    async findOne(_id) {
        return Order.findOne({ _id });
    }

    async updateOne(_id, updateObject) {
        return Order.updateOne({ _id }, updateObject);
    }

    async find(query = {}) {
        return Order.find(query).sort('-createdAt');
    }

    async findRecent() {
        return Order.find().sort('-createdAt').select({ 'ingredients': 1, 'pizzaSize': 1, '_id': 0 }).limit(20);
    }

    async getOrderNumber() {
        return Order.count({ status: 'in_queue' });
    }

    async findMostCommon() {
        return Order.aggregate([
            {
                $unwind: '$ingredients'
            },
            {
                $group: {
                    _id: '$ingredients',
                    numOrders: { $sum: 1 }
                }
            },
            {
                $addFields: { name: '$_id' }
            },
            {
                $project: {
                    _id: 0
                }
            },
            {
                $sort: { numOrders: -1 }
            },
            {
                $limit: 5
            }
        ]);
    }

    async getTotalMoney() {
        return Order.aggregate([
            {
                $group: {
                    _id: null,
                    money: { $sum: '$price' }
                }
            },
            {
                $project: {
                    _id: 0
                }
            }
        ]);
    }
}

module.exports = OrderService;