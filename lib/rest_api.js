var RestApi = function(server) {
  this.server = server;
  this.config = server.config;
}

module.exports = RestApi;

RestApi.prototype.start = function(app){
  var self = this;
  var express = require("express");
  var master = false;
  
  app.use(express.bodyParser());

  app.post('/api/v1/device/:deviceId/command', function(req,res){
    var message = {
      deviceId: req.params.deviceId,
      command:req.body
    };
    console.log(message);
    self.server.publish("device.command",message);
    res.send(message);
  });

  app.get('/api/v1/catalog/:makerId/:modelId/:versionId/api', function(req,res){
    var makerId = req.params.makerId
      , modelId = req.params.modelId
      , versionId = req.params.versionId;

    var v = self.server.catalog.findVersion(makerId,modelId,versionId);
    if (v){
      res.send(v.api);
    } else {
      res.send('Version not found',404);
    }

  });
}