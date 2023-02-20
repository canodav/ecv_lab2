const url = "localhost:9038";
const room_name = "rsddasdssaoom1";

var socket = new WebSocket(`ws://${url}/${room_name}`);

socket.onopen = function () {
    let message = { type: "connection", msg: "Hello server" };
    socket.send(JSON.stringify(message));
};

socket.addEventListener("close", function (e) {
    console.log("Socket has been closed: ", e);
});

socket.onmessage = function (msg) {
    const msgJson = JSON.parse(msg.data);
    console.log(msgJson.type);
    if (msgJson.type === "id") {
        // set the id of the user
        MYAPP.my_user.setId(msgJson.msg.id);
        MYAPP.my_user.setName(msgJson.msg.name);
        console.log(MYAPP.my_user);
        chatlist.addUser(MYAPP.my_user.name);
    }
    if (msgJson.type === "new_user_connected") {
        // add user to the list

        const user = new User(msgJson.msg.id, msgJson.msg.name);
        // see if the user is already in the list
        if (MYAPP.current_room.getUser(user.id) === null)
            MYAPP.current_room.addUser(user);

        chatlist.addUser(user.name);
    }
    if (msgJson.type === "user_move") {
        const user = MYAPP.current_room.getUser(msgJson.msg.id);
        user.target = msgJson.msg.target;
    }
    if (msgJson.type === "user_disconnected") {
        const user = MYAPP.current_room.getUser(msgJson.from_id);
        chatlist.removeUser(user.name);
        MYAPP.current_room.removeUser(user);
    }
    if (msgJson.type === "user_message") {
        const user = MYAPP.current_room.getUser(msgJson.from_id);
        console.log(msgJson);
        const message = msgJson.msg;
        const data = {
            author: user ? user.name : msgJson.from_id,
            content: message.content,
            origin: message.origin,
        };
        messages.receive(data);
    }
};
WebSocket.prototype.storeData = function (key, data) {
    socket.send(
        JSON.stringify({
            type: "store_data",
            msg: {
                key: key,
                data: data,
            },
        })
    );
};

WebSocket.prototype.loadData = function (key, callback) {
   /* socket.send(
        JSON.stringify({
            type: "load_data",
            msg: {
                key: key,
            },
        })
    );
	socket.onmessage = function (msg) {
		const msgJson = JSON.parse(msg.data);
		if (msgJson.type === "load_data") {
			callback(msgJson.msg.data);
		}
	}*/
};

window.onbeforeunload = function () {
    socket.onclose = function () {}; // disable onclose handler first
	messages.saveHistory();
    socket.send(
        JSON.stringify({
            from_id: MYAPP.my_user.id,
            type: "user_disconnected",
            msg: {
                id: MYAPP.my_user.id,
                room: MYAPP.current_room.name,
            },
        })
    );
    socket.close();
};

socket.onclose = function () {};

socket.onerror = function (err) {
    console.log("error: ", err);
};
