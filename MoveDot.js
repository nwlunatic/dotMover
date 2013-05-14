/**
 * Created with JetBrains WebStorm.
 * User: lunatic
 * Date: 5/4/13
 * Time: 11:59 PM
 * To change this template use File | Settings | File Templates.
 */

var canvas = document.getElementById("canvas");

canvas.width = window.innerWidth;
canvas.height = window.innerHeight;

var context = canvas.getContext("2d");

function brezenhamLine(x0, y0, x1, y1) {
    console.log(x0, y0, x1, y1);
    var dx = Math.abs(x1 - x0);
    var dy = Math.abs(y1 - y0);
    var sx = (x0 < x1) ? 1 : -1;
    var sy = (y0 < y1) ? 1 : -1;
    var err = dx - dy;

    var points = [];
    while (true) {
        points.push({"x":x0,"y":y0});

        if ((x0 == x1) && (y0 == y1)) {
            break;
        }
        var e2 = 2 * err;
        if (e2 > -dy) {
            err -= dy;
            x0 += sx;
        }
        if (e2 < dx) {
            err += dx;
            y0 += sy;
        }
    }
    return points;
}

function Dot(context) {
    this.x = 50;
    this.y = 50;
    this.radius = 5;
    this.color = "rgb(200,0,0)";
    if (!context)
        throw new Error("empty context");

    this.speed = 50;

    this.rho = 0.01;
    this.theta = 0;

    this.checkpoints = [];
    this.nextCheckpoint = null;

    this.context = context;

    this.prev_x = null;
    this.prev_y = null;

    this.draw = function () {
        this.context.fillStyle = this.color;
        this.context.beginPath();
        this.context.arc(this.x, this.y, this.radius, 0, Math.PI * 2, true);
        this.context.stroke();
        this.context.fill();

        this.prev_x = this.x;
        this.prev_y = this.y;
    };

    this.setNextCheckpoint = function (checkpoint) {
        if (checkpoint) {
            this.nextCheckpoint = checkpoint;
            this.changeDirection(this.nextCheckpoint);
        } else {
            this.nextCheckpoint = null;
        }
    };

    this.recalculate = function () {
        if (this.checkpoints.length === 0 && this.nextCheckpoint === null)
            return;

        // || means that we are close enough (x+-1 or y+-1)
        if (this.nextCheckpoint.x === Math.floor(this.x) && this.nextCheckpoint.y === Math.floor(this.y)) {
            this.setNextCheckpoint(this.checkpoints.shift());
        }

        var dx = this.speed * this.rho * Math.cos(this.theta);
        var dy = this.speed * this.rho * Math.sin(this.theta);

        this.x += dx;
        this.y += dy;
    };

    this.erase = function () {
        this.context.clearRect(
            this.prev_x - this.radius - 1,
            this.prev_y - this.radius - 1,
            this.radius * 2 + 2,
            this.radius * 2 + 2
        );
    };

    this.setDestination = function (destination) {
        // TODO add collision solver here
        this.checkpoints.push(destination);
        this.setNextCheckpoint(this.checkpoints.shift());
    };

    this.changeDirection = function (position) {
        var x = position.x - this.x;
        var y = position.y - this.y;

        if (x > 0 && y >= 0) {
            this.theta = Math.atan(y / x);
        } else if (x > 0 && y < 0) {
            this.theta = Math.atan(y / x) + 2 * Math.PI;
        } else if (x < 0) {
            this.theta = Math.atan(y / x) + Math.PI;
        } else if (x === 0 && y > 0) {
            this.theta = Math.PI / 2;
        } else if (x === 0 && y < 0) {
            this.theta = 3 * Math.PI / 2;
        } else if (x === 0 && y === 0) {
            this.theta = 0;
        } else {
            throw new Error("Unexpected value of x,y");
        }
    }
}

/* returns coordinates of cursor over canvas element */
function getCursorPosition(e) {
    var x;
    var y;
    if (e.pageX != undefined && e.pageY != undefined) {
        x = e.pageX;
        y = e.pageY;
    }
    else {
        x = e.clientX + document.body.scrollLeft + document.documentElement.scrollLeft;
        y = e.clientY + document.body.scrollTop + document.documentElement.scrollTop;
    }
    x -= canvas.offsetLeft;
    y -= canvas.offsetTop;

    return {"x": x, "y": y};
}

function canvasOnClick(e) {
    var clickPosition = getCursorPosition(e);
    //brezenhamLine(dot.x, dot.y, clickPosition.x, clickPosition.y);
    dot.setDestination(clickPosition);
}

canvas.addEventListener("click", canvasOnClick, false);

var dot = new Dot(context);
var dot2 = new Dot(context);
dot2.y = 100;
dot2.speed = dot2.speed + 10;
dot2.setDestination({"x": 730, "y": 800});
var dot3 = new Dot(context);
dot3.y = 150;
dot3.speed = 100;
dot3.setDestination({"x": 600, "y": 900});

var objects = [];
objects.push(dot);
objects.push(dot2);
objects.push(dot3);

function draw() {
    for (var i = 0, len = objects.length; i < len; i++) {
        objects[i].erase();
        objects[i].draw();
    }
}

function process() {
    for (var i = 0, len = objects.length; i < len; i++) {
        objects[i].recalculate();

        if (window.innerWidth < objects[i].x || objects[i].x < 0)
            objects.splice(i);
        else if (window.innerHeight < objects[i].y || objects[i].y < 0)
            objects.splice(i);
    }
}

var frameRate = 1000 / 60;

setInterval(process, 1);
setInterval(draw, frameRate);
