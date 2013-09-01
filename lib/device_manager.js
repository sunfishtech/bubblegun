var DeviceManager = function(server) {
  this.server = server;
  this.config = server.config;
}

module.exports = DeviceManager;

DeviceManager.prototype.start = function(){
  var self = this;
  this.server.subscribe("device.hereiam", function(msg, env){
    self.onDeviceLogin(msg,env);
  });

  this.server.subscribe("device.goodbye", function(msg, env){
    self.onDeviceLogout(msg,env);
  });

  self.server.log("Device Manager reporting for duty, friend");
}

DeviceManager.prototype.onDeviceLogin = function(msg,env){
  this.server.log("Hello " + msg["deviceId"]);
}

DeviceManager.prototype.onDeviceLogout = function(msg,env){
  this.server.log("Goodbye " + msg["deviceId"]);
}