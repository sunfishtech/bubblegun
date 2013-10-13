var SocketApi = function(server) {
  this.server = server;
  this.config = server.config;
}

module.exports = SocketApi;

SocketApi.prototype.start = function(app, io){
  var self = this;
  this.io = io;

  this.io.sockets.on('connection', function (socket) {
    socket.on('command', function (data) {
      var message = {
        deviceId: data.deviceId,
        command: data.command
      };
      self.server.publish("device.command",message);
    });
  });
  
}