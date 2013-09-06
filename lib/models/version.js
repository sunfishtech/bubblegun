
var Api = require("./api");

var Version = function(model, versionData){
  this.model = model;
  this.maker = this.model.maker;
  this.id = versionData.version;
  this.name = versionData.name || this.id;
  this.api = new Api(versionData.api || {});
}

module.exports = Version;

Version.prototype.toString = function(){
  return this.model.toString() + ", v" + this.name;
}

Version.prototype.matches = function(version) {
  this.toString() == version.toString();
}

Version.UnknownVersion = new Version("Unknown Model", {"version":"unknown"});

