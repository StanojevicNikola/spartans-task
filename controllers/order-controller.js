class OrderController {

    constructor({ config, ingredientService, orderService }) {
        this.config = config;
        this.ingredientService = ingredientService;
        this.orderService = orderService;
    }

    async createOrder(data) {
        try {
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
        } catch (error) {
            return null;
        }
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
        try {
            const orderStatus = await this.orderService.findOne(id);
            if (orderStatus != null)
                return { status: orderStatus.status };
            return { msg: 'Order does not exist' };
        } catch (error) {
            return { msg: 'Could not process your request' };
        }
    }

    async cancelOrder(id) {

        try {
            const order = await this.orderService.findOne(id);
            if (order === null)
                return { msg: 'Order does not exist' };

            if (order.status !== 'in_queue')
                return { msg: 'Bad request' };

            const res = this.orderService.updateOne(id, { status: 'canceled' });
            if (res !== null)
                return { msg: 'Order successfully canceled' };
        } catch (error) {
            return { msg: 'Could not process your request' };
        }
    }

    async getRecentOrders() {
        try {
            const orders = await this.orderService.findRecent();
            return orders;
        } catch (error) {
            return { msg: 'Couldnt process your request' }
        }
    }

    async getTopIngredients() {
        try {
            const result = await this.orderService.findMostCommon();
            return result;
        } catch (error) {
            return { msg: 'Couldnt process your request' }
        }
    }

    async getMoneyEarned() {
        try {
            const result = await this.orderService.getTotalMoney();
            if (result.length === 0)
                return { money: 0 }

            return result[0];
        } catch (error) {
            return { msg: 'Couldnt process your request' }
        }
    }

    async getWorkTimeSinceLastStart() {

        const currentTime = Date.now();
        const uptime = process.uptime() * 1000;
        const startingTime = currentTime - uptime;
        const startingDate = new Date(startingTime);

        try {
            const workingTime = await this.orderService.getWorkingTime(startingDate);
            return workingTime[0] || { time: 0 };
        } catch (error) {
            return { msg: 'Couldnt process your request' }
        }
    }

    async getHistory() {
        try {
            const history = await this.orderService.getHistory();
            return history;
        } catch (error) {
            return { msg: 'Couldnt process your request' }
        }
    }
}

module.exports = OrderController;