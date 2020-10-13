const async = require("async");
const fs = require('fs');

class Consumer {
    constructor({ orderService, config }) {
        this.queue = async.queue(function (task, callback) {
            callback();
        }, 1);

        this.orderService = orderService;
        this.config = config;
        this.step = this.config.step;
        this.busy = false;
        this.order = null;
    }

    reduceDuration() {
        this.duration -= this.step;
        fs.writeFileSync('duration.txt', this.duration);
    }

    async loop() {
        this.reduceDuration();
        if (this.duration <= 0) {
            this.busy = false;
            this.orderService.updateOne(this.order._id, { status: 'served ' });
            console.log('Pizza served!');
            return;
        }
        setTimeout(() => this.loop(), this.step)
    }

    async consume(order) {
        if (!this.checkOrderStatus(order.id))
            return;
        this.order = order;
        this.duration = this.order.totalDuration;
        this.busy = true;
        await this.orderService.updateOne(this.order._id, { status: 'processing' });
        this.queue.push(this.loop());
    }

    async checkOrderStatus(id) {
        const result = await this.orderService.findOne(id);
        if (result.status === 'canceled')
            return false;
        return true;
    }
}

module.exports = Consumer;