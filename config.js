var convict = require('convict');

// define a schema

var conf = convict({
  env: {
    doc: "The applicaton environment.",
    format: ["production", "development", "test"],
    default: "development",
    env: "NODE_ENV"
  },
  mqtt: {
    host: {
      doc: "The MQTT broker.",
      format: String,
      default: "mosquitto.sunfish.io",
      env: "MQTT_HOST",
      arg: "mqtt-host"
    },
      port: {
      doc: "The MQTT port.",
      format: "port",
      default: 1883,
      env: "MQTT_PORT",
      arg:"mqtt-port"
    }
  },
  http:{
    port:{
      doc:"The HTTP port for the REST API",
      format:"port",
      default:4000,
      env: "HTTP_PORT",
      arg:"http-port"
    }
  }
  
});


// load environment dependent configuration

var env = conf.get('env');
conf.loadFile('./config/' + env + '.json');

// perform validation

conf.validate();

module.exports = conf;