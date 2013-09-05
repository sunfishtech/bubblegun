var TypeConverter = function(){
}

module.exports = TypeConverter;

TypeConverter.convert = function(value, type, defaultVal){
  if (value == null) return defaultVal;
  valStr = value.toString();
  if (type == "integer")
    return parseInt(valStr);
  else if (type == "string")
    return valStr;
  else if (type == "number")
    return parseFloat(valStr);
  else
    return value;
}