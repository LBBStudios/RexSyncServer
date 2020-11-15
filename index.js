//RexSyncServer
//Version: 1.0
//License (LGPL-2.1) + repo: https://github.com/LBBStudios/RexSyncServer

//================================================== GLOBALS CREATION ==================================================
var express = require('express');
const { random } = require('lodash');
var app = express();

var http = require('http').Server(app);
var io = require('socket.io')(http);

//Set some app settings:
app.disable('x-powered-by');
app.enable('strict routing');
app.enable('trust proxy');

app.use(function(req, res, next) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, PUT, PATCH, DELETE');
  res.setHeader('Access-Control-Allow-Credentials', true);
  next();
});

//To keep track of users/rooms:
var rooms = {};
var users = {};
var version = "RexSyncServer - v0.4";

//================================================== UTILITY FUNCTIONS ==================================================

//Function to generate a new userID
//Taken from: https://stackoverflow.com/questions/1349404/generate-random-string-characters-in-javascript
function generateUserID() {
  var result           = '';
  var characters       = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
  var charactersLength = characters.length;
  var length = 16;

  for ( var i = 0; i < length; i++ ) {
    result += characters.charAt(Math.floor(Math.random() * charactersLength));
  }

  return "User" + result;
}

//================================================== WEB HEALTH CHECKS ==================================================

app.get('/', function(req, res) {
  res.setHeader('Content-Type', 'text/plain');
  res.send('++Rex Sync Server Active++\nVersion: ' + version);
});

app.get('/roomcount', function(req, res) {
  res.setHeader('Content-Type', 'text/plain');
  res.send("Rooms active: " + String(Object.keys(rooms).length));
});

app.get('/usercount', function(req, res) {
  res.setHeader('Content-Type', 'text/plain');
  res.send("Users online: " + String(Object.keys(users).length));
});

app.get('/metrics', function(req, res) {
  res.setHeader('Content-Type', 'text/plain');
  res.send('++Rex Sync Server Metrics++\n' + 
            "Rooms active: " + String(Object.keys(rooms).length) +
            "\nUsers online: " + String(Object.keys(users).length) + 
            "\nVersion: " + version
            );
});

//================================================== MAIN SERVER LOOP ==================================================

io.on('connection', function(socket) {
  var userID = generateUserID(); //make new userID for this socket
  
  //Keep making new IDs until we find one that isn't in use:
  while (users.hasOwnProperty(userID)) {
    userID = generateUserID(); 
  }

  //If we get here, then they have their ID:
  socket.emit('userID', userID); //send it to the client
  console.log("User " + userID + " has connected to RexSync.");

  //TODO: Handle message from the client here and send appropriate responses.
});

//Actually start the server:
var server = http.listen(process.env.PORT || 3000, function() {
  console.log('RexSync listening on port %d.', server.address().port);
});

setInterval(() => io.emit('time', new Date().toTimeString()), 1000);