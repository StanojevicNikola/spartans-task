const express = require('express');

class App {

    constructor({ orderController, broker }) {
        this.broker = broker;
        this.orderController = orderController;
        this.app = express();

        this.registerMiddleware();
        this.registerRoutes();
    }


    registerMiddleware() {
        this.app.use(express.json());
    }

    registerRoutes() {

        // user routes

        this.app.post('/order/create', async (req, res) => {
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

        this.app.get('/order/check/:id', async (req, res) => {
            const id = req.params.id;
            const result = await this.orderController.checkOrder(id);

            res.json(result);
        });

        this.app.get('/order/cancel/:id', async (req, res) => {
            const id = req.params.id;
            const result = await this.orderController.cancelOrder(id);

            res.json(result);
        });

        this.app.get('/order/recent', async (req, res) => {
            const result = await this.orderController.getRecentOrders();

            res.json(result);
        })


        // admin routes

        this.app.get('/admin/top-5-ingredients', async (req, res) => {
            const result = await this.orderController.getTopIngredients();

            res.json(result);
        });

        this.app.get('/admin/total-money-earned', async (req, res) => {
            const result = await this.orderController.getMoneyEarned();

            res.json(result);
        });


        this.app.get('/admin/session-work-time', async (req, res) => {
            const result = await this.orderController.getWorkTimeSinceLastStart();

            res.json(result);
        });

        this.app.get('/admin/history', async (req, res) => {
            const result = await this.orderController.getHistory();
            res.json(result);
        });
    }
}

module.exports = App;