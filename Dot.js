/**
 * Created with JetBrains WebStorm.
 * User: lunatic
 * Date: 5/17/13
 * Time: 12:15 AM
 * To change this template use File | Settings | File Templates.
 */

function Dot(context) {
    this.x = 50;
    this.y = 50;
    this.radius = 5;
    this.color = "rgb(200,0,0)";
    if (!context)
        throw new Error("empty context");
    this.context = context;

    this.speed = 100;

    this.rho = 0;
    this.theta = 0;

    this.checkpoints = [];
    this.nextCheckpoint = null;

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

    this.erase = function () {
        this.context.clearRect(
            this.prev_x - this.radius - 1,
            this.prev_y - this.radius - 1,
            this.radius * 2 + 3,
            this.radius * 2 + 3
        );
    };

    this.recalculate = function () {
        if (this.checkpoints.length === 0 && this.nextCheckpoint === null)
            return;

        console.log(this.rho);
        // we are close enough (x+-1 or y+-1)
        if (this.rho <= 0) {
            this.setNextCheckpoint(this.checkpoints.shift());
        }

        var distance = this.speed / 100;
        if (distance > this.rho )
            distance = this.rho;

        this.rho -= distance;


        var dx = distance * Math.cos(this.theta);
        var dy = distance * Math.sin(this.theta);

        this.x += dx;
        this.y += dy;
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
    };

    this.setNextCheckpoint = function (checkpoint) {
        if (checkpoint) {
            this.nextCheckpoint = checkpoint;
            this.changeDirection(this.nextCheckpoint);
            console.log(this.nextCheckpoint);

            var dx = this.x - this.nextCheckpoint.x;
            var dy = this.y - this.nextCheckpoint.y;

            this.rho = Math.sqrt(Math.pow(dx,2) + Math.pow(dy,2));
        } else {
            this.nextCheckpoint = null;
        }
    };

    this.setDestination = function (destination) {
        // TODO add collision solver here
        this.checkpoints.push(destination);
        this.setNextCheckpoint(this.checkpoints.shift());
    };
}