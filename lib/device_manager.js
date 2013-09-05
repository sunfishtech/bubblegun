var Device = require("./models/device");

var DeviceManager = function(server) {
  this.server = server;
  this.config = server.config;
  this.devices = {};
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
  this.server.subscribe("device.reading", function(msg, env){
    self.onDeviceReading(msg.deviceId,msg.command,msg.arguments);
  });
  this.server.subscribe("device.command", function(msg, env){
    self.onDeviceCommand(msg.deviceId,msg.command);
  });

  self.server.log("Device Manager reporting for duty, friend");
}

DeviceManager.prototype.onDeviceLogin = function(msg,env){
  var maker = msg.arguments[0]
    , model = msg.arguments[1]
    , version = msg.arguments[2]

  this.loginDevice(msg.deviceId,maker,model,version);
}

DeviceManager.prototype.onDeviceLogout = function(msg,env){
  this.logoutDevice(msg.deviceId);
}

DeviceManager.prototype.loginDevice = function(id,makerId,modelId,versionId){
  var device = this.devices[id];
  var version = this.server.catalog.findVersion(makerId,modelId,versionId);
  if (!device){
    device = new Device(this,id,version);
  } else {
    if (!device.version.matches(version))
      device.upgradeTo(version);
  }
  device.login();
  this.devices[id] = device;
  this.server.log("Login: " + device.toString());
  return device;
}

DeviceManager.prototype.logoutDevice = function(id) {
  var device = this.devices[id];
  if (device) {
    device.logout();
    this.server.log("Logout: " + device.toString());
  }
  else {
    this.server.log("Logout: " + id + " (Unknown)");
  }
  return device;
}

DeviceManager.prototype.onDeviceReading = function(deviceId, commandId, arguments){
  var device = this.getDevice(deviceId);
  if (!device) {
    var err = "Received a reading from an unknown device:" + deviceId + ". The command was: " + commandId + " " + JSON.stringify(arguments);
    this.server.publish("error",{message:err, deviceId:deviceId, command:commandId, arguments:arguments});
  } else {
    device.addReading(commandId, arguments);
  }
}

DeviceManager.prototype.onDeviceCommand = function(deviceId, commandData){
  var device = this.getDevice(deviceId);
  if (!device){
    var err = "Received a command for an unknown device:" + deviceId + ". The command was:" + JSON.stringify(commandData);
    this.server.pubish("error",{message:err, deviceId:deviceId,commandData:commandData});
  } else {
    device.sendCommand(commandData);
  }
}

DeviceManager.prototype.getDevice = function(deviceId){
  return this.devices[deviceId];
}