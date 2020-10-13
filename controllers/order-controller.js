const { response } = require("express");
const order = require("../models/order");

class OrderController {

    constructor({ config, ingredientService, orderService }) {
        this.config = config;
        this.ingredientService = ingredientService;
        this.orderService = orderService;
    }

    async createOrder(data) {
        const orderInformation = await this.calculateOrder(data);
        const { time, price } = orderInformation;
        const orderNumber = await this.orderService.getOrderNumber() + 1;

        data.totalDuration = time;
        data.timeLeft = time;
        data.price = price;
        data.orderNumber = orderNumber;
        if (data.orderNumber > 15) {
            data.status = 'rejected'
            return null;
        }
        const result = await this.orderService.insert(data);
        return result;
    }

    async calculateOrder(data) {
        const { pizzaSize, ingredients } = data;

        let time = this.config.pizza[`${pizzaSize}`].time;

        let price = this.config.pizza[`${pizzaSize}`].price;

        if (ingredients !== null) {
            const extraTime = await this.ingredientService.accumulatedTime(ingredients);
            time += extraTime[0].totalTime;
            price += extraTime[0].totalPrice;
        }

        return { time, price };
    }

    async checkOrder(id) {
        const orderStatus = await this.orderService.findOne(id);
        if (orderStatus != null)
            return orderStatus.status;
        return 'not_existing';
    }

    async cancelOrder(id) {
        const order = await this.orderService.findOne(id);
        if (order == null)
            return { msg: 'Order does not exist' };

        const res = this.orderService.updateOne(id, { status: 'canceled' });
        if (res != null)
            return { msg: 'Order successfully canceled' };
    }

    async getRecentOrders() {
        const orders = await this.orderService.findRecent();
        return orders;
    }

    async getTopIngredients() {
        const result = await this.orderService.findMostCommon();
        return result;
    }

    async getMoneyEarned() {
        const result = await this.orderService.getTotalMoney();
        if (result.length === 0)
            return { money: 0 }

        return result[0];
    }
}

module.exports = OrderController;