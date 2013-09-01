var RestApi = function(server) {
  this.server = server;
  this.config = server.config;
}

module.exports = RestApi;

RestApi.prototype.start = function(){
  var self = this;
  var express = require("express");
  var app = express();

  app.get('/api/v1/device/:deviceId/command/:command', function(req,res) {
    var message = {
      deviceId: req.params.deviceId,
      command: req.params.command
    }
    self.server.publish("device.command",message);
    res.send(message);
  });

  app.listen(this.config.get('http.port'));
}