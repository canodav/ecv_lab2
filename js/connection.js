var server = new SillyClient();
const room_name = localStorage.getItem("room");
server.connect(
    "wss://ecv-etic.upf.edu/node/9000/ws",
    "MYSUPERAPP_" + room_name
);
var current_id;

const user_header_username = document.querySelector("#chat-sidebar-header-username");
const chat_header_room = document.querySelector("#chat-box-header-title-id");

//this method is called when the server accepts the connection (no ID yet nor info about the room)
server.on_connect = function () {
    //connected
    console.log("connected");

};

//this method is called when the server gives the user his ID (ready to start transmiting)
server.on_ready = function (id) {
    //user has an ID
    current_id = id;
    user_header_username.innerHTML = id;
    messages.loadHistory();

};

//this method is called when we receive the info about the current state of the room (clients connected)
server.on_room_info = function (info) {
    //to know which users are inside
    info.clients.forEach(function (user) {
        chatlist.addUser(user);
    });
    chat_header_room.innerHTML = room_name;
};

//this methods receives messages from other users (author_id is an unique identifier per user)
server.on_message = function (author_id, msg) {
    //data received
    const data = JSON.parse(msg);
    messages.receive({
        author: data.author,
        content: data.content,
        origin: "remote",
    });
};

//this methods is called when a new user is connected
server.on_user_connected = function (user_id) {
    //new user!
    chatlist.addUser(user_id);
    
};

//this methods is called when a user leaves the room
server.on_user_disconnected = function (user_id) {
    //user is gone
    chatlist.removeUser(user_id);
};

//this methods is called when the server gets closed (it shutdowns)
server.on_close = function () {
    //server closed
    messages.saveHistory();
};

//this method is called when coulndt connect to the server
server.on_error = function (err) {};
