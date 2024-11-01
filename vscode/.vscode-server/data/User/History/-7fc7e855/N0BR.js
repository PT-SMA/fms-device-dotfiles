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

const nodered = "http://10.10.100.150:1880/gpsd";

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

        const spawn = require('child_process').spawn;

        let temp = spawn('cat', ['/sys/class/thermal/thermal_zone0/temp']);

        temp.stdout.on('data', function(data) {
                console.log('Result: ' + data/1000 + ' degrees Celcius');
        });
        
        
        const currentCoords = turf.point([data.lon, data.lat]);
        
        if (lastCoords !== null) {
          const distance = turf.distance(lastCoords, currentCoords, { units: 'meters' });

          axios.post(`${nodered}`, {
            lon: data.lon,
            lat: data.lat,

          });

          console.log('distance: ', distance);
          lastCoords = turf.point([data.lon, data.lat]);
        } else {
          lastCoords = turf.point([data.lon, data.lat]);
        }
      })
    }
  })

})