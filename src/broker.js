const EventEmitter = require('events');
const cron = require('node-cron');

class Broker extends EventEmitter {

    constructor( {orderQueue, consumer }) {
        super();
        this.orderQueue = orderQueue;
        this.consumer = consumer;
        this._listen();
    }

    _listen() {
        this.on('newOrder', (order) => {
            this.orderQueue.push(order);
        })
    }

    notify() {
        if (this.consumer.busy) {
            return;
        }
        const nextOrder = this.orderQueue.pop();
        if (nextOrder === 0) {
            return;
        }
        this.consumer.consume(nextOrder);
    }

}

module.exports = Broker;