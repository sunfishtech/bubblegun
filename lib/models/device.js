var Version = require("./version");
var Reading = require("./reading");

var Device = function(manager, id, version, opts){
  this.manager = manager;
  this.server = manager.server;
  this.id = id;
  this.version = version || Version.UnknownVersion;
  this.model = this.version.model;
  this.maker = this.version.maker;
  var opts = opts || {};
  this.status = "initialized";
  this.latestReadings = {};
}

module.exports = Device;

Device.prototype.login = function(){
  this.last_login = new Date();
  this.status = "online";
  return this;
}

Device.prototype.logout = function(){
  this.last_logout = new Date();
  this.status = "offline";
  return this;
}

Device.prototype.upgradeTo = function(newVersion) {
  this.version = newVersion;
  return this;
}

Device.prototype.addReading = function(commandId,arguments) {
  var spec = this.version.api.getOutputSpec(commandId);
  var self = this;
  if (spec){
    var val =  spec.parseValue(arguments[0]);
    var reading = new Reading(this,spec,val);
    var topic = "reading." + reading.id;
    this.latestReadings[spec.command] = reading;
    this.server.publish(topic,reading);
  } else {
    var err = "Received an unknown reading from " + this.toString() + ". The command was: " + commandId + " " + JSON.stringify(arguments);
    this.server.publish("error",{message:err,deviceId:self.id,command:commandId,arguments:arguments});
    return false;
  }
}

Device.prototype.sendCommand = function(commandData){
  var commandName = commandData.name;
  var spec = this.version.api.getInputSpec(commandName);
  var self = this;
  if (spec){
    cmd = spec.formatCommand(commandData);
    cmd.deviceId = this.id;
    var topic = "device.command.mqtt";
    this.lastcommand = cmd;
    this.server.publish(topic,cmd);
  } else {
    var err = "Received an unknown command for " + this.id + ". The command data was " + JSON.stringify(commandData);
    this.server.publish("error",{message:err, deviceId:self.id,commandData:commandData});
  }
}

Device.prototype.toString = function() {
  return this.id + " : " + this.version.toString();
}