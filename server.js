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


        app.post('/order/create', async (req, res) => {
            const data = req.body;
            const result = await this.orderController.createOrder(req.body);
            if (result !== null) {
                this.broker.emit('newOrder', result);
                res.json({
                    orderNumber: result.orderNumber,
                    waitingTime: result.totalDuration
                });
            } else {
                res.json({ msg: 'Try later' });
            }

        })

        app.get('/order/check/:id', async (req, res) => {
            const id = req.params.id;
            const result = await this.orderController.checkOrder(id);

            res.json({ status: result });
        });

        app.get('/order/cancel/:id', async (req, res) => {
            const id = req.params.id;
            const result = await this.orderController.cancelOrder(id);

            res.json(result);
        });

        app.get('/order/recent', async (req, res) => {
            const result = await this.orderController.getRecentOrders();
            res.json(result);
        })


        app.get('/admin/top-5-ingredients', async (req, res) => {
            const result = await this.orderController.getTopIngredients();
            res.json(result);
        });

        app.get('/admin/total-money-earned', async (req, res) => {
            const result = await this.orderController.getMoneyEarned();
            res.json(result);
        });


        app.get('/admin/uptime', async (req, res) => {
            res.json({ secondsSinceLastStart: process.uptime() });
        })

        app.listen(port, () => {
            console.log('Listening');
        });
    }
}

module.exports = Server;
