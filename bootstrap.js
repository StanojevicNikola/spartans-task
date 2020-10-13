const awilix = require('awilix');
const cron = require('node-cron');

const server = require('./server');
const consumer = require('./src/consumer');
const broker = require('./src/broker');
const orderQueue = require('./src/order-queue');
const config = require('./config.json');
const storage = require('./storage');
const recovery = require('./src/recovery');

class Bootstrap {
    constructor() {
        this._bootstrap();
    }

    _bootstrap() {
        this.container = awilix.createContainer({
            injectionMode: awilix.InjectionMode.PROXY,
        });

        this.container.loadModules(
            ['./services/*.js', './controllers/*.js'], {
            formatName: 'camelCase',
            resolverOptions: {
                lifetime: awilix.Lifetime.SINGLETON,
                register: awilix.asClass,
            },
        },
        );

        this.container.register({
            config: awilix.asValue(config),
            orderQueue: awilix.asClass(orderQueue).singleton(),
            broker: awilix.asClass(broker).singleton(),
            server: awilix.asClass(server).singleton(),
            consumer: awilix.asClass(consumer).singleton(),
            storage: awilix.asClass(storage).singleton(),
            recovery: awilix.asClass(recovery).singleton(),
        });


    }

    async start() {

        cron.schedule('*/5 * * * * *', () => {
            this.container.resolve('broker').notify();
        });

        await this.container.resolve('storage').connect();
        await this.container.resolve('recovery').recover();
        this.container.resolve('server').start();
    }

}

module.exports = Bootstrap;