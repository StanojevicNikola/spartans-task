const fs = require('fs');

class Recovery {

    constructor({ orderService, orderQueue, consumer }) {
        this.orderQueue = orderQueue;
        this.orderService = orderService;
        this.consumer = consumer;
    }

    async recover() {
        await this.loadProcessingTask();
        await this.loadQueue();
    }

    async loadQueue() {
        const enqueuedOrders = await this.orderService.find({ status: 'in_queue' });
        this.orderQueue.appendOrders(enqueuedOrders);
    }

    async loadProcessingTask() {
        const processingOrders = await this.orderService.find({ status: 'processing' });
        if (processingOrders.length === 0) {
            return;
        }
        const processingOrder = processingOrders[0];
        processingOrders.totalDuration = 1000;
        this.consumer.consume(processingOrder);
    }
}

module.exports = Recovery;