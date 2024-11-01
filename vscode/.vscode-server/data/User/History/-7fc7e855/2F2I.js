const axios = require("axios");
const gpsd = require("node-gpsd");

const daemon = new gpsd.Daemon({
  program: 'gpsd',
  device: '/dev/ttyUSB0',
  port: 2947,
  pid: '/tmp/gpsd.pid',
  readOnly: false,
  logger: {
      info: function() {},
      warn: console.warn,
      error: console.error
  }
});

daemon.start(() => {
  console.log('start GPSD');

  const listener = new gpsd.Listener({
    port: 2947,
    hostname: 'localhost',
    parse: true
  });

  listener.connect(() => {
    if (listener.isConnected()) {
      listener.watch();

      listener.on('TPV', (data) => {
        console.log(data, 'gps Data');
      })
    }
  })

})