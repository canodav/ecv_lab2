class User {
    constructor(id, name) {
        this.id = id;
        this.name = name;
        this.position = [0, 0];
        this.room = null;
        this.avatar = 'character_1.png';
    }


    toString() {
        return this.name;
    }

    toJSON() {
        return {
            id: this.id,
            name: this.name,
            position: this.position,
            avatar: this.avatar
        }
    }

}


module.exports = User;