class Room {
    constructor(id, name) {
        this.id = id;
        this.name = name;
        this.url = null;
        this.people = [];
        this.background = "https://mir-s3-cdn-cf.behance.net/project_modules/max_1200/01073865290819.5d61d475f0072.jpg";
    }
    addUser(user) {
        this.people.push(user);
        user.room = this;
    }
    removeUser(user) {
        this.people = this.people.filter((u) => u.id != user.id);
    }       
}


module.exports = Room;