const express = require('express');
const order = require('./models/order');
const port = 3000;

class Server {

    constructor({ broker, orderController, orderService }) {
        this.broker = broker;
        this.orderController = orderController;
        this.orderService = orderService;
    }

    start() {
        const app = express();
        app.use(express.json());


        app.post('/order', async (req, res) => {
            const data = req.body;
            const result = await this.orderController.createOrder(req.body);
            let response = { msg: 'Your order is rejected ' };
            if (result !== null) {
                this.broker.emit('newOrder', result);
                response = result;
                response.msg = 'Happy';
            }
            res.json({ data: response });
        })

        app.listen(port, () => {
            console.log('Listening');
        });
    }
}

module.exports = Server;
