var Website = function(server) {
  this.server = server;
  this.config = server.config;
}

module.exports = Website;

Website.prototype.start = function(app){
  var self = this;
  var express = require("express")
    , routes = require("../routes")
    , path = require("path");

  app.set('views',__dirname + '/../views');
  app.set('view engine', 'ejs');
  app.use(express.bodyParser());
  app.use(express.favicon());
  app.use(express.logger('dev'));
  app.use(express.methodOverride());
  app.use(app.router);
  app.use(express.static(path.join(__dirname, '/../public')));

  app.get('/', function(req,res){
    self.server.deviceManager.findDevice("abc123", function(err,device){
      res.render("index", {device:device,api:device.version.api});
    });
  });
}