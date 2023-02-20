var http = require('http');
var url = require('url');

var connections = {};

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

    // Connection is the client
    connection.on('message', function(message) {
        if (message.type === 'utf8') {
            // Get the message type
            const msg = JSON.parse(message.utf8Data);
            const from_id = msg.from_id;
            const type = msg.type;
            const data = msg.msg;
            // Get unique id from the connection
            // if type is connection
            if (type === "connection") {

                userId++;
                const user = new User(userId, "user" + userId);
                connection.sendUTF(JSON.stringify(user.toJSON())); // send the message to the client

                // Send id to the client
                const id_message = new Message("id", user.toJSON());
                connection.sendUTF(id_message.toJSONString());


                // send msg to all the users of wsServer
                const message = new Message("new_user_connected", user.toJSON());
               
                for (var conn in connections) {
                    connections[conn].sendUTF(message.toJSONString());
                }

                connections[userId] = connection;

                room1.addUser(user);
            }   

            // if type is move
            if (type === "user_move") {
                // get the user from the list of users with the id of from_id
                // TODO search in a specific room
                var user = null;
                
                const room = data.room;
                // Get the room from the list of rooms with name room
                rooms.forEach(function (r) {
                    if(r.name === room){
                        user = r.getUser(from_id);
                    }
                });

                if(user === null){
                    return;
                }
                user.target = data.target;

                // send msg to all the users of wsServer
                const message = new Message("user_move", user.toJSON(), from_id);
                
                const connections_clone = Object.assign({}, connections);
                delete connections_clone[from_id];

                for (var conn in connections_clone) {
                    connections_clone[conn].sendUTF(message.toJSONString());
                }
            }

            if (type === "user_disconnected"){
                // TODO remove user from the list of users
                var user = null;
                const room = data.room;
                // Get the room from the list of rooms with name room
                rooms.forEach(function (r) {
                    if(r.name === room){
                        user = r.getUser(from_id);
                        r.removeUser(user);
                    }
                });

                if(user === null){
                    return;
                }
                const message = new Message("user_disconnected", user.toJSONString(), from_id);
            
                wsServer.connections.forEach(function (connection) {
                    connection.sendUTF(message.toJSONString());
                });
                delete connections[from_id];
                
            }

            if(type === "user_message"){
                const message = new Message("user_message", data, from_id);

                const connections_clone = Object.assign({}, connections);
                delete connections_clone[from_id];

                for (var conn in connections_clone) {
                    connections_clone[conn].sendUTF(message.toJSONString());
                }
            }


            if(type == "store_data"){
                const store_data = JSON.parse(data.data);
                //console.log(store_data);
               // db.save(data.key, JSON.stringify(store_data));
            }


        }
    });

    connection.on('close', function(e) {
	    //connection is this
	    console.log("USER IS GONE");// close user connection
        
    });
});


