var Model = require("./model");

var Maker = function(catalog, data) {
  self = this;
  this.catalog = catalog;
  this.id = data.id;
  this.name = data.name || this.id;
  this.models = {};
  if (data.models && data.models.length > 0){
    data.models.forEach(function(modelData){
      self.addModel(modelData);
    });
  }
}

module.exports = Maker;

Maker.prototype.addModel = function(modelData) {
  model = new Model(this, modelData);
  this.models[model.id] = model;
  return model;
}

Maker.prototype.findVersion = function(modelId, version){
  var model = this.models[modelId];
  if (model) {
    return model.findVersion(version);
  }
  return null;
}

Maker.prototype.toString = function(){
  return this.name;
}