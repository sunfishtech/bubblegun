var ReadingSpec = require("./reading_spec");
var CommandSpec = require("./command_spec");

var Api = function(apiData) {
  var self = this;
  this.inputs = {};
  this.outputs = {};
  if (apiData.outputs){
    apiData.inputs.forEach(function(inputData){
      self.addInputSpec(inputData);
    });
    apiData.outputs.forEach(function(outputData){
      self.addOutputSpec(outputData);
    }); 
  }
}

module.exports = Api;

Api.prototype.addOutputSpec = function(outputData){
  var spec = new ReadingSpec(outputData);
  this.outputs[spec.command] = spec;
}

Api.prototype.addInputSpec = function(inputData){
  var spec = new CommandSpec(inputData);
  this.inputs[spec.identifier] = spec;
}

Api.prototype.getOutputSpec = function(commandId){
  return this.outputs[commandId.toString()];
}

Api.prototype.getInputSpec = function(commandName){
  return this.inputs[commandName.toString()];
}
