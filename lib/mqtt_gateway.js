var MqttGateway = function(server) {
  this.server = server;
  this.config = server.config;
  this.argumentDelimiter = "|";
}

module.exports = MqttGateway;

MqttGateway.prototype.start = function(){
  var self = this;
  var mqtt = require('mqtt');

  self.client = mqtt.createClient(this.config.get('mqtt.port'),this.config.get('mqtt.host'));

  var topics = ["device/+/reading","device/+/hereiam","device/+/goodbye"];
  topics.forEach(function(topic){
    self.client.subscribe(topic)
  });
  self.client.on('message', function(topic, message) {
    self.receiveMessage(topic, message);
  });

  this.server.subscribe("device.command.mqtt", function(msg){
    self.publishCommand({
      deviceId:msg.deviceId,
      command: [msg.command].concat(msg.arguments).join("|")
    });
  });

  this.server.log("MQTT Gateway is large and in charge, boss");
}

MqttGateway.prototype.publishCommand = function(msg) {
  var topic = "device/" + msg.deviceId + "/command";
  var message = msg.command + "\n";
  this.client.publish(topic, message, {retain:true});
  this.server.log("Published " + message + " to " + topic);
}

MqttGateway.prototype.receiveMessage = function(topic,message){
  var args = message.split(this.argumentDelimiter);
  var segments = topic.split("/")
    , mTopic = "device." + segments[2]
    , payload = {
        deviceId:segments[1]
      , command:args.shift()
      , arguments:args
    }
  this.server.publish(mTopic, payload);
}