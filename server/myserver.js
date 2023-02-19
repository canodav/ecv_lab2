var http = require('http');
var url = require('url');
const User = require('./users.js');
const Room = require('./rooms.js');
const Message = require('./messages.js');
let rooms = []; 
var userId = 0;


const room1 = new Room(1, "Hall");
const room2 = new Room(2, "Street");

rooms.push(room1);
rooms.push(room2);

var server = http.createServer( function(request, response) {

	var url_info = url.parse( request.url, true ); //all the request info is here
	var pathname = url_info.pathname; //the address
	var params = url_info.query; //the parameters

    
	response.setHeader('Access-Control-Request-Method', '*');
	response.setHeader('Access-Control-Allow-Origin', '*');
	response.setHeader('Access-Control-Allow-Methods', 'OPTIONS, GET');
	response.setHeader('Access-Control-Allow-Headers', '*');

    if (pathname == "/rooms") {
        response.writeHead(200, {'Content-Type': 'application/json'});
        response.end(JSON.stringify(rooms));
    }
});

server.listen(9038, function() {
	console.log("Server ready!" );
});

var WebSocketServer = require('websocket').server;
const wsServer = new WebSocketServer({ // create the server
    httpServer: server //if we already have our HTTPServer in server variable...
});

wsServer.on('request', function(request) {

    var connection = request.accept(null, request.origin);
    userId++;
    const user = new User(userId, "user" + userId);
    connection.sendUTF(JSON.stringify(user.toJSON())); // send the message to the client


    // Connection is the client
    connection.on('message', function(message) {
        if (message.type === 'utf8') {
            // Get the message type
            const msg = JSON.parse(message.utf8Data);
            const type = msg.type;
            const data = msg.msg;

            // if type is connection
            if (type === "connection") {
                // Send id to the client
                const id_message = new Message("id", user.toJSON());
                connection.sendUTF(id_message.toJSONString());

                // send msg to all the users of wsServer
                const message = new Message("new_user_connected", user.toJSON());
                wsServer.connections.forEach(function (connection) {
                    connection.sendUTF(message.toJSONString());
                });
                
            }   

            // if type is move
            if (type === "user_move") {
                user.position = data.position;

                // send msg to all the users of wsServer
                const message = new Message("user_move", user.toJSON());
                wsServer.connections.forEach(function (connection) {
                    connection.sendUTF(message.toJSONString());
                });
            }
        }
    });

    connection.on('close', function() {
	  //connection is this
	  console.log("USER IS GONE");// close user connection
      // Remove user from the room
        // Remove user from the list of users
        // Send msg to all the users of wsServer
        /*
        rooms.forEach(function (room) {
            room.removeUser(user);
        });

        const message = new Message("user_disconnected", user.toJSON());
        wsServer.connections.forEach(function (connection) {
            connection.sendUTF(message.toJSONString());
        }
        */

    });
});


