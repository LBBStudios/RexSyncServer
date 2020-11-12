//RexSyncServer
//Version: 1.0
//License (LGPL-2.1) + repo: https://github.com/LBBStudios/RexSyncServer

const PORT = process.env.PORT || 3000;
const INDEX = '/index.html';

const server = express()
  .use((req, res) => res.sendFile(INDEX, { root: __dirname }))
  .listen(PORT, () => console.log(`Listening on ${PORT}`));

const { Server } = require('ws');

const wss = new Server({ server });

wss.on('connection', (ws) => {
    console.log('Client connected');
    ws.on('close', () => console.log('Client disconnected'));
});

//This sends something without the client asking for it
//Will re-tool this later for the currentTime value / play state.
setInterval(() => {
    wss.clients.forEach((client) => {
        client.send(new Date().toTimeString());
    });
}, 1000);

/*wsServer.on('request', function(request) {
    const connection = request.accept(null, request.origin);

    connection.on('message', function(message) {
        console.log("Received message: " + message.utf8Data);
        connection.sendUTF("Hi this is the server");
    });

    connection.on('close', function(reasonCode, desc) {
        console.log("Client has disconnected for reason: " + reasonCode + " (" + desc + ")");
    });
});*/