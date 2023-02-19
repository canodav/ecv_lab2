const room_user_list = document.querySelector('#room-user-list');

const chatlist = {

    init: function() {

    },

    addUser: function(user_id) {
        const user_container = document.createElement('li');
        user_container.classList.add('user-container');
        user_container.id = `user-${user_id}`;
        user_container.innerHTML = `
            <div class="user-container-name">${user_id}</div>
        `;
        room_user_list.appendChild(user_container);
    },
    removeUser: function(user) {
        const user_container = document.querySelector(`#user-${user}`);
        room_user_list.removeChild(user_container);
    }
}
