var Mqtt = require("./mqtt_gateway")
  , Devices = require("./device_manager")
  , Rest = require("./rest_api")
  , Catalog = require("./catalog")
  , Database = require("./persistence_manager")
  , _ = require("underscore");

var Server = function(){
}

module.exports = Server;

Server.prototype.start = function(){
  var self = this;
  this.config = require('../config.js');
  this.postal = require('postal')();
  this.channel = this.postal.channel();
  this.mqtt = this.startService("mqtt",Mqtt);
  this.deviceManager = this.startService("devices",Devices);
  this.api = this.startService("restApi",Rest);
  this.catalog = this.startService("catalog",Catalog);
  this.database = this.startService("database",Database);

  this.subscribe("error", function(msg){
    self.log(msg);
  });
}

Server.prototype.startService = function(serviceName, serviceClass) {
  this.services = this.services || {};
  var svc = this.services[serviceName] = new serviceClass(this);
  if (svc.start && _.isFunction(svc.start))
    svc.start();
  return svc;
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