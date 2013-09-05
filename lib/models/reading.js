var Reading = function(device,spec,value){
  this.device = device;
  this.specification = spec;
  this.value = value.value;
  this.caption = value.caption;
  this.id = this.device.id + "." + this.specification.name;
}

module.exports = Reading;

Reading.prototype.toString = function(){
  return this.id + "=" + this.caption;
}