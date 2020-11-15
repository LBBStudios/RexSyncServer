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

//================================================== UTILITY FUNCTIONS ==================================================

//Function to generate a new userID
function generateUserID() {
  return 'user' + random();
}

//================================================== WEB HEALTH CHECKS ==================================================

app.get('/', function(req, res) {
  res.setHeader('Content-Type', 'text/plain');
  res.send("++Rex Sync Server Active++");
});

app.get('/roomcount', function(req, res) {
  res.setHeader('Content-Type', 'text/plain');
  res.send("Rooms active: " + String(Object.keys(rooms).length));
});

app.get('/usercount', function(req, res) {
  res.setHeader('Content-Type', 'text/plain');
  res.send("Users online: " + String(Object.keys(users).length));
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