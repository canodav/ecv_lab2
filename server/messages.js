class Message {
    constructor(type, data) {
        this.type = type;
        this.msg = data;
    }
    toJSON() {
        return {
            type: this.type,
            msg: this.msg
        };
    }

    toJSONString() {
        // Return a string representation of the JSON object
        return JSON.stringify(this.toJSON());

    }
}

module.exports = Message;