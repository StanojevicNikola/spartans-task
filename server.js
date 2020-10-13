class Server {

    constructor({ app, config }) {
        this.app = app;
        this.config = config;
    }

    start() {

        this.app.app.listen(this.config.port, () => {
            console.log(`Server is running on port ${this.config.port}`);
        });
    }
}

module.exports = Server;
