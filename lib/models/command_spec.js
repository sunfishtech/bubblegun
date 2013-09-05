var TypeConverter = require("../type_converter")
  , CommandArgumentSpec = require("./command_argument_spec")
  , _ = require("underscore");

var CommandSpec = function(specData){
  self = this;
  this.command = specData.command;
  this.name = specData.name;
  this.identifier = specData.identifier || specData.name;
  this.description = specData.description;
  this.arguments = [];
  if (specData.arguments){
    specData.arguments.forEach(function(argument){
      self.addArgument(argument);
    });
  }
}

module.exports = CommandSpec;

CommandSpec.prototype.addArgument = function(argData){
  var arg = new CommandArgumentSpec(argData);
  this.arguments.push(arg);
  return arg;
}

CommandSpec.prototype.formatCommand = function(commandData){
  var args = _.map(this.arguments, function(arg){
    return commandData[arg.identifier] || arg.defaultValue;
  });
  return {
    command:this.command,
    arguments:_.compact(args)
  }
}