/**
 * Created with JetBrains WebStorm.
 * User: lunatic
 * Date: 5/4/13
 * Time: 11:59 PM
 * To change this template use File | Settings | File Templates.
 */

var screen = document.getElementById("screen");

var canvases = { charactersCanvas: document.getElementById("characters-layer"),
    stageCanvas: document.getElementById("stage-layer")
};

(function () {
    function resizeCanvas() {
        for (var canvas in canvases) {
            canvases[canvas].width = window.innerWidth;
            canvases[canvas].height = window.innerHeight;
            console.log(canvases[canvas].width, canvases[canvas].height);
        }
    }

    resizeCanvas();
    // resize the canvas to fill browser window dynamically
    window.addEventListener('resize', resizeCanvas, false);
})();

var contexts = { charactersContext: canvases.charactersCanvas.getContext("2d"),
    stageContext: canvases.stageCanvas.getContext("2d")
};

function brezenhamLine(x0, y0, x1, y1) {
    console.log(x0, y0, x1, y1);
    var dx = Math.abs(x1 - x0);
    var dy = Math.abs(y1 - y0);
    var sx = (x0 < x1) ? 1 : -1;
    var sy = (y0 < y1) ? 1 : -1;
    var err = dx - dy;

    var points = [];
    while (true) {
        points.push({"x": x0, "y": y0});

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

/* returns coordinates of cursor over canvas element */
function getCursorPosition(e) {
    var x, y;
    var canvas = e.target;

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

    var point = {"x": x, "y": y};

    return point;
}

function screenOnClick() {
    for (var canvas in canvases) {
        canvases[canvas].onclick();
    }
}

function canvasOnClick(e) {
    var clickPosition = getCursorPosition(e);
    dot.setDestination(clickPosition);
}

//screen.addEventListener("click", screenOnClick, false);
canvases.charactersCanvas.addEventListener("click", canvasOnClick, false);

var dot = new Dot(contexts.charactersContext);
//var dot2 = new Dot(contexts.charactersContext);
//dot2.y = 100;
//dot2.speed += 1;
//dot2.setDestination({"x": 730, "y": 800});
//var dot3 = new Dot(contexts.charactersContext);
//dot3.y = 150;
//dot3.speed += 2;
//dot3.setDestination({"x": 600, "y": 900});

var objects = [];
objects.push(dot);
//objects.push(dot2);
//objects.push(dot3);

var grid = new Grid(contexts.stageContext);
grid.draw();

function draw() {
    for (var i = 0, len = objects.length; i < len; i++) {
        objects[i].erase();
        objects[i].draw();
    }
}

function process() {
    for (var i = 0; i < objects.length; i++) {
        objects[i].recalculate();

        if (window.innerWidth < objects[i].x || objects[i].x < 0)
            objects.splice(i, 1);
        else if (window.innerHeight < objects[i].y || objects[i].y < 0)
            objects.splice(i, 1);
    }
}

var frameRate = 1000 / 60;

setInterval(process, 1);
setInterval(draw, frameRate);
