#!/usr/bin/env node
var dgram = require("dgram");
let internalIp = require("internal-ip");

var socket = dgram.createSocket("udp4");

(async () => {
  socket.bind(33333, await internalIp.v4());
})();

socket.on("listening", function () {
  console.log(
    "UDP Server listening on " +
      socket.address().address +
      ":" +
      socket.address().port
  );
});

socket.on("message", function (message, remote) {
  console.log(remote.address + ":" + remote.port + " - " + message);
});

function sendPublicDataToClients() {
  if (publicEndpointA && publicEndpointB) {
    var messageForA = new Buffer(JSON.stringify(publicEndpointB));
    socket.send(
      messageForA,
      0,
      messageForA.length,
      publicEndpointA.port,
      publicEndpointA.address,
      function (err, nrOfBytesSent) {
        if (err) return console.log(err);
        console.log("> public endpoint of B sent to A");
      }
    );

    var messageForB = new Buffer(JSON.stringify(publicEndpointA));
    socket.send(
      messageForB,
      0,
      messageForB.length,
      publicEndpointB.port,
      publicEndpointB.address,
      function (err, nrOfBytesSent) {
        if (err) return console.log(err);
        console.log("> public endpoint of A sent to B");
      }
    );
  }
}
