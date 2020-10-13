const Bootstrap = require('./bootstrap');

new Bootstrap().start().catch((e) => {
  console.error(e);
  process.exit(-1);
});
