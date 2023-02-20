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
        if(user == null) return;
        if (user.room != this) return;
        this.people = this.people.filter((u) => u.id != user.id);
    }    
    getUser(id) {
        // find the user with the given id
        for (let i = 0; i < this.people.length; i++) {
            if (this.people[i].id == id) return this.people[i];
        }
        return null;
    }
}


module.exports = Room;