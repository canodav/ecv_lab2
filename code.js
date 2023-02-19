const canvas = document.getElementById('world');
var last = performance.now();
var keys = {};
var mouse_pos = [0, 0];
var mouse_buttons = 0;
var imgs = {};

function loop() {

    // Update our canvas
    draw();

    const now = performance.now();
    const elapsed_time = (now - last) / 1000;
    last = now;

    update(elapsed_time);

    requestAnimationFrame(loop);
}

loop();

function getImage(url) {
    if (imgs[url]) {
        return imgs[url];
    }

    var img = imgs[url] = new Image();
    img.src = url;
    return img;
}

function draw() {
    var parent = canvas.parentNode;
    var rect = parent.getBoundingClientRect();
    canvas.width = rect.width;
    canvas.height = rect.height;
    
    const ctx = canvas.getContext('2d');

    MYAPP.draw(canvas, ctx);
}

function update(elapsed_time) {
    MYAPP.update(elapsed_time); 
}

function onMouse(e) {
    const rect = canvas.getBoundingClientRect();
    var canvasx = mouse_pos[0] = e.clientX - rect.left;
    var canvasy = mouse_pos[1] = e.clientY - rect.top;
    mouse_buttons = e.buttons;


    // if the mopuse position is within the canvas
    if (canvasx > 0 && canvasx < canvas.width && canvasy > 0 && canvasy < canvas.height) {
        MYAPP.onMouse(e);
    }

}

document.body.addEventListener('mousedown', onMouse);
document.body.addEventListener('mousedown', onMouse);
document.body.addEventListener('mousemove', onMouse);

function onKeyDown(e) {
    keys[e.key] = true;
    MYAPP.onKey(e);
}

function onKeyUp(e) {
    keys[e.key] = false;
}

document.body.addEventListener('keydown', onKeyDown);
document.body.addEventListener('keyup', onKeyUp);

MYAPP.init();