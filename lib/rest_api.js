var RestApi = function(server) {
  this.server = server;
  this.config = server.config;
}

module.exports = RestApi;

RestApi.prototype.start = function(){
  var self = this;
  var express = require("express");
  var app = express();

  app.configure(function(){
    app.use(express.bodyParser());
  });

  app.post('/api/v1/device/:deviceId/command', function(req,res){
    var message = {
      deviceId: req.params.deviceId,
      command:req.body
    };
    self.server.publish("device.command",message);
    res.send(message);
  });

  app.listen(this.config.get('http.port'));

  this.server.log("The HTTP API has its ear to the ground on port " + this.config.get('http.port'));
}