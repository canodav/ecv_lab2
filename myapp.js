const FACING_RIGHT = 0;
const FACING_FRONT = 1;
const FACING_LEFT = 2;
const FACING_BACK = 3;

class User {
    constructor() {
        this.name = "unnamed";
        this.position = [0, 0];
        this.user_id = 1;
        this.room = null;
        this.avatar = 'character_1.png';
        this.facing = FACING_FRONT;
        this.animation = 'idle';
        this.target = [0, 0];
    }

}

class Room {
    constructor(name) {
        this.id = -1;
        this.name = name;
        this.url = null;
        this.people = [];
    }
    addUser(user) {
        this.people.push(user);
        user.room = this;
    }
}


var WORLD = {
    rooms: {},
    lastId: 0,

    createRoom: function (name, url) {
        var room = new Room(name);
        room.id = this.lastId++;
        room.url = url;

        this.rooms[name] = room;
        return room;
    },
};

var MYAPP = {
    current_room: null,
    my_user: null,

    init: function () {
        WORLD.createRoom("room1", "https://www.w3schools.com/tags/smiley.gif");
        this.current_room = WORLD.createRoom(
            "room2",
            "https://mir-s3-cdn-cf.behance.net/project_modules/max_1200/01073865290819.5d61d475f0072.jpg"
        );
        
        this.my_user = new User();
        this.current_room.addUser(this.my_user);

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
        
        var img = getImage(room.url);
        ctx.drawImage( getImage(room.url), -canvas.width / 2, -canvas.height / 2, canvas.width, canvas.height );
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

        ctx.drawImage(img, frame * 32, facing * 64, 32, 64, user.position[0] - 16 ,user.position[1] - 20, 32, 64);
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
        if (!this.my_user) return;
        var diff = [this.my_user.target[0] - this.my_user.position[0], this.my_user.target[1] - this.my_user.position[1]];
        var delta = diff;

  

        this.my_user.position[0] += delta[0] * dt;
        this.my_user.position[1] += delta[1] * dt;

        // Update facing direction
        var angle = Math.atan2(delta[1], delta[0]);
        if (angle > - Math.PI / 4 && angle < Math.PI / 4) {
            this.my_user.facing = FACING_RIGHT;
        } else if (angle > Math.PI / 4 && angle < (3 * Math.PI) / 4) {
            this.my_user.facing = FACING_FRONT;
        } else if (angle > (3 * Math.PI) / 4 || angle < -(3 * Math.PI) / 4) {
            this.my_user.facing = FACING_LEFT;
        } else {
            this.my_user.facing = FACING_BACK;
        }


        // Update animation
        if (delta[0] ==  0 && delta[1] == 0) {
            this.my_user.animation = 'idle';
        } else {
            this.my_user.animation = 'walking';
        }

        console.log(delta)
    },
    onMouse: function (e) {
        if (e.type == "mousedown") {
            var local_pos = this.canvasToWorld(mouse_pos);
            this.my_user.target = local_pos;
           
        } else if (e.type == "mousemove") {
        } else {
            // mouseup
        }
    },
    onKey: function (e) {},
};
