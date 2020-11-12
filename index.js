//RexSyncServer
//Version: 1.0
//License (LGPL-2.1) + repo: https://github.com/LBBStudios/RexSyncServer

const http = require('http');
const WebSocketServer = require('websocket').server;

const server = http.createServer();
server.listen(7859);

const wsServer = new WebSocketServer({
    httpServer: server
});

wsServer.on('request', function(request) {
    const connection = request.accept(null, request.origin);

    connection.on('message', function(message) {
        console.log("Received message: " + message.utf8Data);
        connection.sendUTF("Hi this is the server");
    });

    connection.on('close', function(reasonCode, desc) {
        console.log("Client has disconnected for reason: " + reasonCode);
        console.log("\t" + desc);
    });
});