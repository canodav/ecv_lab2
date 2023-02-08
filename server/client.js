const url = "localhost:9038";
var socket = new WebSocket("ws://" + url );

socket.onopen = function(){  
    this.send("Hello server!");  //send something to the server
}

socket.addEventListener("close", function(e) {
	console.log("Socket has been closed: ", e); 
});

socket.onmessage = function(msg){  
	console.log( msg.data ); //Awesome!  
	
}

socket.onerror = function(err){  
	console.log("error: ", err );
}