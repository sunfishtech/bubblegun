var Version = require("./version");
var Reading = require("./reading");

var Device = function(manager, data){
  this.manager = manager;
  this.server = manager.server;

  this.id = data.id;

  this.latestReadings = {};
  this.lastCommand = null;

  this.status = data.status || "initialized";
  this.lastLogin = data.lastLogin || new Date();
  this.version = this.server.catalog.findVersion(data.makerId,data.modelId,data.versionId) || Version.UnknownVersion;
  this.model = this.version.model;
  this.maker = this.version.maker;
}

module.exports = Device;

Device.prototype.login = function(){
  this.lastLogin = new Date();
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

Device.prototype.addReading = function(commandId,args) {
  var spec = this.version.api.getOutputSpec(commandId);
  var self = this;
  if (spec){
    var val =  spec.parseValue(args[0]);
    var reading = new Reading(this,spec,val);
    var topic = "reading." + reading.id;
    this.latestReadings[spec.command] = reading;
    this.server.publish(topic,reading);
  } else {
    var err = "Received an unknown reading from " + this.toString() + ". The command was: " + commandId + " " + JSON.stringify(args);
    this.server.publish("error",{message:err,deviceId:self.id,command:commandId,arguments:args});
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
    this.lastCommand = cmd;
    this.server.publish(topic,cmd);
  } else {
    var err = "Received an unknown command for " + this.id + ". The command data was " + JSON.stringify(commandData);
    this.server.publish("error",{message:err, deviceId:self.id,commandData:commandData});
  }
}

Device.prototype.toString = function() {
  return this.id + " : " + this.version.toString();
}


Device.prototype.toHash = function(){
  return {
    id:this.id,
    versionId:this.version.id,
    modelId:this.model && this.model.id,
    makerId:this.maker && this.maker.id,
    status:this.status,
    lastLogin:this.lastLogin
  }
}