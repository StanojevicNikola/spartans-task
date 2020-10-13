class OrderQueue {

    constructor() {
        this.queue = [];
    }

    appendOrders(orders) {
        this.queue = this.queue.concat(orders);
    }

    push(order) {
        this.queue.push(order);
    }

    pop() {
        if (this.queue.length === 0) {
            return 0;
        }
        return this.queue.pop();
    }

}

module.exports = OrderQueue;