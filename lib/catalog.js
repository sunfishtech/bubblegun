var Maker = require("./models/maker");

var Catalog = function(server){
  this.server = server;
  this.config = server.config;
  this.makers = {};
  var self = this;
  var makerData = null;
  if (makerData = this.config.get("catalog.makers")) {
    makerData.forEach(function(m){
      self.addMaker(m);
    });
  }
}

module.exports = Catalog;

Catalog.prototype.addMaker = function(makerData){
  var maker = new Maker(this, makerData);
  this.makers[maker.id] = maker;
  return maker;
}

Catalog.prototype.findVersion = function(makerId,modelId,version){
  var maker = this.makers[makerId];
  if (maker){
    return maker.findVersion(modelId,version);
  }
  return null;
}

