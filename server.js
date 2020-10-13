const express = require('express');
const order = require('./models/order');
const port = 3000;

class Server {

    constructor({ app }) {
        this.app = app;
    }

    start() {

        this.app.app.listen(port, () => {
            console.log(`Server is running on port ${port}`);
        });
    }
}

module.exports = Server;
