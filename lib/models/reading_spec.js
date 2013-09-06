var TypeConverter = require("../type_converter");

var ReadingSpec = function(specData){
  this.command = specData.command;
  this.readingType = specData.readingType;
  this.name = specData.name;
  this.dataType = specData.dataType;
  this.valueMap = specData.values || {};
  this.defaultValue = specData.defaultValue;
  this.documentation = specData.documentation;
  this.persist = !!specData.persist;
}

module.exports = ReadingSpec;

ReadingSpec.prototype.parseValue = function(readingValue){
  var value = TypeConverter.convert(readingValue, this.dataType, this.defaultValue);
  var valStr = value.toString();
  var label = this.valueMap[valStr] || valStr;
  return {value:value, caption:label};
}