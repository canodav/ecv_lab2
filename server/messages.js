class Message {
    constructor( type, data, from_id) {
        this.from_id = from_id;
        this.type = type;
        this.msg = data;
    }
    toJSON() {
        return {
            from_id: this.from_id,
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