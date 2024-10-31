const axios = require("axios");
const gpsd = require("node-gpsd");
const turf = require("@turf/turf");

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

let lastCoords = null;

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
        
        
        const currentCoords = turf.point([data.lon, data.lat]);
        
        if (lastCoords !== null) {
          const distance = turf.distance(lastCoords, currentCoords, { units: 'meters' });

          console.log('distance: ', distance);
        } else {
          lastCoords = turf.point([data.lon, data.lat]);
        }
      })
    }
  })

})