const chat_box = document.querySelector('#chat-box-body'); 
let message_history = [];

const messages = {

    render : function (data) {
        const message_container = document.createElement('div');
        const message = document.createElement('div');
        message_container.classList.add('message-container');
        message_container.appendChild(message);
         
        message.classList.add('message');
        message.classList.add('message__' + data.origin);
        message.innerHTML = `
            <div class="message-author">${data.author}</div>
            <div class="message-content">${data.content}</div>
        
        `;
        chat_box.appendChild(message_container);
        chat_box.scrollTop = chat_box.scrollHeight;
    },
    send: function (data) {

        const content = data.msg.content;
        if (content.length == 0) {
            return;
        }
        const author_username = localStorage.getItem("user");
        data.author = author_username ? author_username : data.author;
        this.render({
            author: data.from_id,
            content: content,
            origin: "local"
        })

        socket.send(JSON.stringify(data));
        this.saveMessageInHistory(data);
    },
    receive: function (data) {
        this.render(data);
        this.saveMessageInHistory(data);
    },
    saveMessageInHistory: function (msg) {
        message_history.push({
            type: msg.type,
            content: msg.msg.content,
            author: msg.author
        });
        console.log(message_history)
        this.saveHistory();
    },
    saveHistory: function () {
        const key = "chat_history_" + localStorage.getItem("user") + "_" + localStorage.getItem("room");
        socket.storeData(key, JSON.stringify(message_history));
    },
    loadHistory: async function () {
        const key = "chat_history_" + localStorage.getItem("user") + "_" + localStorage.getItem("room");
        server.loadData(key, function (data) {
            if (data) {
                const history = JSON.parse(data);
                history.forEach(function (msg) {
                    msg.origin = localStorage.getItem("user") == msg.author ? "local" : "remote";
                    messages.render(msg);
                    message_history.push(msg);
                });
            }
        });
    }
}

const chat_input = document.querySelector('#chat-input'); 
const input = chat_input.querySelector('input');
console.log(input);
chat_input.addEventListener('submit', function (e) {

    messages.send({from_id: MYAPP.my_user.id, type: "user_message", msg:{
        content: input.value
    }});

    input.value = "";

    e.preventDefault();
});


