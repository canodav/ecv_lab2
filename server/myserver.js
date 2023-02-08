var http = require('http');
var url = require('url');
var userId = 0;


var server = http.createServer( function(request, response) {
	console.log("REQUEST: " + request.url );
	var url_info = url.parse( request.url, true ); //all the request info is here
	var pathname = url_info.pathname; //the address
	var params = url_info.query; //the parameters

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
    connection.sendUTF(userId); // send the message to the client
    userId++;
    // Connection


    connection.on('message', function(message) {
        if (message.type === 'utf8') {
            // Convert Message to JSON
            console.log(JSON.parse(message.utf8Data));
            connection.sendUTF(message.utf8Data);
        }
    });

    connection.on('close', function() {
	  //connection is this
	  console.log("USER IS GONE");// close user connection
    });
});


