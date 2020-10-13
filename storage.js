const mongoose = require('mongoose');

mongoose.Promise = global.Promise;

class MongoDB {
    constructor({ config }) {
        this.config = config;
    }

    async connect() {
        const { url, database } = this.config.storage.mongodb;
        await mongoose.connect(
            `${url}${database}`, { useUnifiedTopology: true, useNewUrlParser: true },
        )
            .then(() => console.log(`Connected to ${url} ${database}`))
            .catch((err) => console.log('connection failed'));
    }

    async disconnect() {
        await mongoose.disconnect();
    }

    async drop() {
        await mongoose.connection.db.dropDatabase();
    }
}

module.exports = MongoDB;