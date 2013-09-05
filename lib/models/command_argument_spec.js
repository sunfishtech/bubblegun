var TypeConverter = require("../type_converter");

var CommandArgumentSpec = function(specData){
  this.name = specData.name;
  this.identifier = specData.identifier;
  this.description = specData.description;
  this.dataType = specData.dataType || "string";
  this.defaultValue = specData.defaultValue;
  this.minValue = specData.minValue;
  this.maxValue = specData.maxValue;
  this.regex = specData.regex;
}

module.exports = CommandArgumentSpec;