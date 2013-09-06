var mongo = require('mongoskin')
  , Device = require("./models/device")
  , _ = require("underscore");

var PersistenceManager = function(server){
  this.server = server;
  this.config = server.config;
  this.uri = this.config.get("mongo.uri");
}

module.exports = PersistenceManager;

PersistenceManager.prototype.start = function(){
  this.db = mongo.db(this.uri);
  this.devices = this.db.collection("devices");
  this.devices.ensureIndex([['id',1]], true, function (err, replies) {});
}

PersistenceManager.prototype.findOrCreateDevice = function(manager, deviceData, callback){
  var self = this;
  var opts = { new:true, upsert:true };
  this.devices.findAndModify({id:deviceData.id},[],deviceData,opts, function(err,doc){
    var device = null;
    if (!err) device = new Device(manager,doc);
    callback(err, device);
  });
}

PersistenceManager.prototype.findDevice = function(manager, deviceId, callback){
  var self = this;
  this.devices.findOne({id:deviceId},function(err,doc){
    var device = null;
    if(!err && doc) device = new Device(manager, doc);
    callback(err,device);
  });
}