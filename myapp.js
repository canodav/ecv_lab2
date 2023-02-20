const FACING_RIGHT = 0;
const FACING_FRONT = 1;
const FACING_LEFT = 2;
const FACING_BACK = 3;

class User {
    constructor(id, name) {
        this.name = name;
        this.position = [0, 0];
        this.id = id;
        this.room = null;
        this.avatar = 'character_1.png';
        this.facing = FACING_FRONT;
        this.animation = 'idle';
        this.target = [0, 0];
    }

    setId(id) {
        this.id = id;
    }
    setName(name) {
        this.name = name;
    }
}

class Room {
    constructor(id, name, url, people, bg) {
        this.id = id;
        this.name = name;
        this.url = url;
        this.people = people;
        this.background = bg;
    }
    addUser(user) {
        this.people.push(user);
        user.room = this;
    }
    getUser(id) {
        // find the user with the given id
        for (let i = 0; i < this.people.length; i++) {
            if (this.people[i].id == id) return this.people[i];
        }
        return null;
    }
    removeUser(user) {
        // find the user with the given id
        for (let i = 0; i < this.people.length; i++) {
            if (this.people[i].id == user.id) {
                this.people.splice(i, 1);
                return;
            }
        }
    }
}


var WORLD = {
    rooms: {},
    lastId: 0,

    createRoom: function (id, name, url, people, bg) {
        var room = new Room(id, name, url, people, bg);
        this.rooms[name] = room;
        return room;
    },
};

var MYAPP = {
    current_room: null,
    my_user: null,

    init: async function () {
       
        var rooms = await fetch("http://localhost:9038/rooms")
        rooms = await rooms.json();


        for (let i = 0; i < rooms.length; i++) {
            WORLD.createRoom(rooms[i].id, rooms[i].name, rooms[i].url, rooms[i].people, rooms[i].background);
        }

        this.current_room = WORLD.rooms["Hall"]

        this.my_user = new User(-1, "unnamed")
        this.current_room.addUser(this.my_user);

        this.current_room.people.forEach(function (user) {
            chatlist.addUser(user.name);
        })
    },

    draw: function (canvas, ctx) {
        ctx.imageSmoothingEnabled = false;
        ctx.clearRect(0, 0, canvas.width, canvas.height);

        ctx.fillStyle = "red";
        ctx.fillRect(mouse_pos[0], mouse_pos[1], 50, 50);

        ctx.save();
        ctx.translate(canvas.width / 2, canvas.height / 2);
        ctx.scale(4, 4);
        if (this.current_room) this.drawRoom(canvas, ctx, this.current_room);
    },

    //transform from your world coordinate system (0,0 is center) to canvas coordinate (0,0 is top left)
    worldToCanvas: function ( pos )
        {
        return [
            (pos[0] + canvas.width / 2) / 4,
            (pos[1] + canvas.height / 2) / 4
        ];
    },

    //transform from canvas coordinates (0,0 is top-left) to
    //your own offset world coordinates
    canvasToWorld : function ( pos ){
        return [
            (pos[0] - canvas.width / 2 ) / 4,
            (pos[1] - canvas.height / 2) / 4,
        ];
    },



    drawRoom: function (canvas, ctx, room) {
        
        var img = getImage(room.background);
        ctx.drawImage( getImage(room.background), -canvas.width / 2, -canvas.height / 2, canvas.width, canvas.height );
        // Draw users
        room.people.forEach((user) => {
            this.drawUser(ctx, user);
        });
    },

    animations: {
        idle: [0],
        walking : [2, 3, 4, 5, 6, 7, 8, 9],
        talking: [0, 1],
    },

    drawUser: function (ctx, user) {
        if (!user.avatar) return;

        var anim = this.animations[user.animation];

        const time = performance.now() / 1000;
        const img = getImage("/assets/" + user.avatar);
        const frame = anim[Math.floor(time * 10) % anim.length ];
        var facing = user.facing;

        ctx.drawImage(img, frame * 32, facing * 64, 32, 64, user.position[0] - 16 ,user.position[1] - 20, 32/1.3, 64/1.3);
        ctx.beginPath();
        ctx.rect( user.position[0],  user.position[1], 20, 20);
        ctx.stroke();

        // draw a line to the target
        ctx.beginPath();
        ctx.moveTo(user.position[0], user.position[1]);
        ctx.lineTo(user.target[0], user.target[1]);
        ctx.stroke();
      

    },
    update: function (dt) {
        // Update users
        if(this.current_room){        
            for (let i = 0; i < this.current_room.people.length; i++) {
                    
            
                if (!this.current_room.people[i]) return;
                var diff = [this.current_room.people[i].target[0] - this.current_room.people[i].position[0], this.current_room.people[i].target[1] - this.current_room.people[i].position[1]];
                var delta = diff;
                

                // Update facing direction
                var angle = Math.atan2(delta[1], delta[0]);
                if (angle > - Math.PI / 4 && angle < Math.PI / 4) {
                    this.current_room.people[i].facing = FACING_RIGHT;
                } else if (angle > Math.PI / 4 && angle < (3 * Math.PI) / 4) {
                    this.current_room.people[i].facing = FACING_FRONT;
                } else if (angle > (3 * Math.PI) / 4 || angle < -(3 * Math.PI) / 4) {
                    this.current_room.people[i].facing = FACING_LEFT;
                } else {
                    this.current_room.people[i].facing = FACING_BACK;
                }

                if(delta[0] > 30){
                    delta[0] = 30;
                }else if(delta[0] < -30){
                    delta[0] = -30;
                }
                else if (delta[0] > -2 && delta[0] < 2){
                    delta[0] = 0;
                }
                if(delta[1] > 30){
                    delta[1] = 30;
                }else if(delta[1] < -30){
                    delta[1] = -30;
                }
                else if (delta[1] > -4 && delta[1] < 4){
                    delta[1] = 0;
                }
        
                
                this.current_room.people[i].position[0] += delta[0] * dt;
                this.current_room.people[i].position[1] += delta[1] * dt;


                // Update animation
                if (delta[0] ==  0 && delta[1] == 0) {
                    this.current_room.people[i].animation = 'idle';
                } else {
                    this.current_room.people[i].animation = 'walking';
                }
            }
        }
    },


    onMouse: function (e) {
        if (e.type == "mousedown") {
            var local_pos = this.canvasToWorld(mouse_pos);
            this.my_user.target = local_pos;
            socket.send(JSON.stringify({
                from_id: this.my_user.id,
                type: "user_move", 
                msg: {
                    id: this.my_user.id,
                    room: this.current_room.name,
                    target: local_pos 
                }
            }));
           
        } else if (e.type == "mousemove") {

        } else {
            // mouseup
        }
    },
    onKey: function (e) {},
};
