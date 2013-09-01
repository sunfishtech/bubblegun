var Mqtt = require("./mqtt_gateway")
  , Devices = require("./device_manager")
  , Rest = require("./rest_api");

var Server = function(){

}

module.exports = Server;

Server.prototype.start = function(){
  this.config = require('../config.js');
  this.postal = require('postal')();
  this.channel = this.postal.channel();
  this.startService("mqtt",Mqtt);
  this.startService("devices",Devices);
  this.startService("restApi",Rest);
}

Server.prototype.startService = function(serviceName, serviceClass) {
  this.services = this.services || {};
  this.services[serviceName] = new serviceClass(this);
  this.services[serviceName].start();
}

Server.prototype.log = function(message) {
  console.log(message);
}

Server.prototype.subscribe = function(topic, callback) {
  this.channel.subscribe(topic, callback);
}

Server.prototype.publish = function(topic, message) {
  this.channel.publish(topic, message);
}

new Server().start();