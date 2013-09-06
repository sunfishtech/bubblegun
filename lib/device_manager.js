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
  var self = this;
  this.findOrCreateDevice(id, makerId, modelId, versionId, function(err, device){
    if (err){
      self.server.publish("error",err);
    } else {
      if (!device.version.id == versionId){
        device.upgradeTo(version);
      }
      device.login();
      self.server.log("Login: " + device.toString());
    }
  });
}

DeviceManager.prototype.logoutDevice = function(id) {
  var self = this;
  this.findDevice(id, function(err, device){
    if (device) {
      device.logout();
      self.server.log("Logout: " + device.toString());
    } else {
      self.server.log("Logout: " + id + " (Unknown)");
    }
  });
}

DeviceManager.prototype.onDeviceReading = function(deviceId, commandId, args){
  var self = this;
  this.findDevice(deviceId, function(err, device){
    if (!device) {
      var err = "Received a reading from an unknown device:" + deviceId + ". The command was: " + commandId + " " + JSON.stringify(args);
      self.server.publish("error",{message:err, deviceId:deviceId, command:commandId, arguments:args});
    } else {
      device.addReading(commandId, args);
    }
  });
}

DeviceManager.prototype.onDeviceCommand = function(deviceId, commandData){
  var self = this;
  this.findDevice(deviceId, function(err, device){
     if (!device){
      var err = "Received a command for an unknown device:" + deviceId + ". The command was:" + JSON.stringify(commandData);
      self.server.pubish("error",{message:err, deviceId:deviceId,commandData:commandData});
    } else {
      device.sendCommand(commandData);
    }
  });
}

DeviceManager.prototype.findOrCreateDevice = function(deviceId, makerId, modelId, versionId, callback){
  var self = this;
  var deviceData = {
    id:deviceId,
    makerId:makerId,
    modelId:modelId,
    versionId:versionId
  };
  this.server.database.findOrCreateDevice(this, deviceData, function(err, device){
    if(!err) self.devices[deviceId] = device;
    callback(err, device);
  });
}

DeviceManager.prototype.findDevice = function(deviceId, callback) {
  var self = this;
  var device = this.devices[deviceId];
  if (!device){
    this.server.database.findDevice(this, deviceId,function(err,device){
      if (err){
        this.server.publish("error",err);
      } else {
        self.devices[deviceId] = device;
        callback(err, device);
      }
    });
  } else {
    callback(null, device);
  }
}