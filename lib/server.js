var Mqtt = require("./mqtt_gateway")
  , Devices = require("./device_manager")
  , Website = require("./website")
  , Rest = require("./rest_api")
  , Socket = require("./socket_api")
  , Catalog = require("./catalog")
  , Database = require("./persistence_manager")
  , Express = require("express")
  , _ = require("underscore");

var Server = function(){
}

module.exports = Server;

Server.prototype.start = function(){
  var self = this;
  var app = Express()
    , server = require('http').createServer(app)
    , io = require('socket.io').listen(server);

  this.config = require('../config.js');
  this.postal = require('postal')();
  this.channel = this.postal.channel();
  this.mqtt = this.startService("mqtt",Mqtt);
  this.deviceManager = this.startService("devices",Devices);
  this.website = this.startService("website", Website, app);
  this.rest_api = this.startService("restApi", Rest, app);
  this.socket_api = this.startService("socketApi",Socket, app, io);
  this.catalog = this.startService("catalog",Catalog);
  this.database = this.startService("database",Database);

  this.subscribe("error", function(msg){
    self.log(msg);
  });

  server.listen(this.config.get('http.port'))
}

Server.prototype.startService = function(serviceName, serviceClass, app, io) {
  this.services = this.services || {};
  var svc = this.services[serviceName] = new serviceClass(this);
  if (svc.start && _.isFunction(svc.start)) {
    svc.start(app, io);
  }
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