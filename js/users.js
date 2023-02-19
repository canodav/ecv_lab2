const users = {

    register: function (user_id, username) {
        const key = "chat_user_" + localStorage.getItem("room") + "_" + user_id;
        server.storeData(key,  username);
    },
    load: async function (user_id) {
        const key = "chat_user_" + localStorage.getItem("room") + "_" + user_id;
        server.loadData(key, function (data) {
            if (data) {
                chatlist.addUser(user_id, data);
            }
        });
    }    
}