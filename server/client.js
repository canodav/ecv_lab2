const url = "localhost:9038";
const room_name = "rsddasdssaoom1";

var socket = new WebSocket(`ws://${url}/${room_name}`);


socket.onopen = function(){  
	console.log("Connected to server");

	let message = {type: "connection", msg: "Hello server"}
	socket.send(JSON.stringify(message));
	
}

socket.addEventListener("close", function(e) {
	console.log("Socket has been closed: ", e); 
});

socket.onmessage = function(msg){  

	const msgJson = JSON.parse(msg.data);
	if(msgJson.type === "id"){
		// set the id of the user
		MYAPP.my_user.setId(msgJson.msg.id);
		
	}
	if(msgJson.type === "new_user_connected"){
		// add user to the list
		const user = new User(msgJson.msg.id, msgJson.msg.name);
		MYAPP.current_room.addUser(user);
		
	}
	if(msgJson.type === "user_move"){
		const user = MYAPP.current_room.getUser(msgJson.msg.id);
		user.position = msgJson.msg.position;
	}
	
	
}

socket.onerror = function(err){  
	console.log("error: ", err );
}

