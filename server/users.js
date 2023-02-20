class User {
    constructor(id, name) {
        this.id = id;
        this.name = name;
        this.room = null;
        this.avatar = 'character_1.png';
        this.facing = 0;
        this.animation = 'idle';
        this.position = [0, 0];
        this.target = [0, 0];
    }


    toString() {
        return this.name;
    }

    toJSON() {
        return {
            id: this.id,
            name: this.name,
            position: this.position,
            avatar: this.avatar,
            facing: this.facing,
            animation: this.animation,
            target: this.target
        }
    }

    toJSONString() {
        return JSON.stringify(this.toJSON());
    }

}


module.exports = User;