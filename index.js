// http is part of core.  We need it to run createServer
const http = require('http');
// We need to bring in the Express module so we can use the router, public folder, etc.
const express = require('express');
var socketio = require('socket.io');
var app = express();

app.use(express.static(__dirname + '/public'));

var users = [];
var messageLog = [];
var colorArray = ['#B94503','#A3034E','#77025A','#718E93','#866BBA','#BA6983','#377771', '#318F72']


// run createServer against http like always but hand it the app (express)
var server = http.createServer(app);
server.listen(8080);
// make a new var called io that is listening to the listener
var io = socketio.listen(server); //ONLY listening at ws://localhost:8080

// the way that socket.io works...
// 1. .on to listen
// 2. .emit to send

io.sockets.on('connect', (socket)=>{
	console.log('someone connected via a socket!!')
	// ADD ALL EVENT LISTENERS
	socket.on('nameToServer', (data)=>{
		var clientInfo = {
			name: data,
			clientId: socket.id,
			time: new Date(),
			color: colorArray.pop()
		};
		for(let i=0; i<users.length;i++){
			if(clientInfo.clientId == users[i].clientId){
				userWhoLeft = users[i];
				users.splice(i,1);

				var usersUpdate = {
					users: users,
					userWhoLeft: userWhoLeft
					}
					io.sockets.emit('removeUser', usersUpdate);
			}
		}
		
		users.push(clientInfo);
		console.log(clientInfo.name);
		// emit takes 2 args:
		// 1. event...we make this up(except for connect/disconnect)
		// 2. data to send via ws
		io.sockets.emit('newUser',users);
	});
	socket.on('messageToServer', (messageObject)=>{
		messageLog.push(messageObject);
		io.sockets.emit('messageToClient',messageObject);
	});

	socket.on('disconnect', ()=>{
		var userWhoLeft;
		for(let i=0; i<users.length;i++){
			if(socket.id == users[i].clientId){
				userWhoLeft = users[i];
				users.splice(i,1);
			}
		}
		usersUpdate = {
			users: users,
			userWhoLeft: userWhoLeft
		}
		io.sockets.emit('removeUser', usersUpdate);
	})
});


// console.log('The server is listening on port 8080');


