var Version = require("./version");

var Model = function(maker, modelData){
  this.maker = maker;
  this.id = modelData.id;
  this.name = modelData.name || this.id;
  this.versions = {};
  var self = this;
  if (modelData.versions && modelData.versions.length > 0){
    modelData.versions.forEach(function(versionData){
      self.addVersion(versionData);
    });
  }
}

module.exports = Model;

Model.prototype.addVersion = function(versionData) {
  version = new Version(this, versionData);
  this.versions[version.id] = version;
  return version;
}

Model.prototype.findVersion = function(version) {
  return this.versions[version];
}

Model.prototype.toString = function(){
  return this.name + " by " + this.maker.toString();
}