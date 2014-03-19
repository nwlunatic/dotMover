function Character(characterLayer) {
    this.characterLayer = characterLayer;

    this.speed = 300;
    this.rho = 0;
    this.theta = 0;

    this.path = [];
    this.nextCheckpoint = null;

    this.init();
}

Character.prototype.init = function () {
    this.character = new Kinetic.Circle({
        x: 12,
        y: 12,
        radius: 6,
        fill: 'red',
        stroke: 'black',
        strokeWidth: 1
    });

    this.characterLayer.add(this.character);

    this.x = this.character.x();
    this.y = this.character.y();
}

Character.prototype.getPosition = function () {
    return this.character.getPosition();
}

Character.prototype.move = function (path) {
    var _path = deepCopy(path);
    _path.shift();
    this.path = _path;
}

Character.prototype._recalculate = function (frame) {
    if (this.path.length === 0 && this.nextCheckpoint === null)
        return;

    if (this.rho <= 0) {
        this._setNextCheckpoint(this.path.shift());
    }

    var distance = this.speed / 100;
    if (distance > this.rho )
        distance = this.rho;

    this.rho -= distance;


    var dx = distance * Math.cos(this.theta);
    var dy = distance * Math.sin(this.theta);

    this.x += dx;
    this.y += dy;

    this.character.x(this.x);
    this.character.y(this.y);
}

Character.prototype._setNextCheckpoint = function (checkpoint) {
    if (checkpoint) {
        this.nextCheckpoint = checkpoint;
        this._changeDirection(this.nextCheckpoint);

        var dx = this.x - this.nextCheckpoint[0];
        var dy = this.y - this.nextCheckpoint[1];

        this.rho = Math.sqrt(Math.pow(dx,2) + Math.pow(dy,2));
    } else {
        this.nextCheckpoint = null;
    }
};

Character.prototype._changeDirection = function (position) {
    var x = position[0] - this.x;
    var y = position[1] - this.y;

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