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

    async getOrderNumber() {
        return Order.count({ status: 'in_queue' });
    }
}

module.exports = OrderService;