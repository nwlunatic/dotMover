function Map(mapLayer) {
    this.mapLayer = mapLayer;
    this.field = [
        [0, 0, 1, 0, 0],
        [0, 0, 0, 0, 0],
        [1, 0, 1, 0, 0],
        [0, 0, 0, 1, 0],
        [1, 0, 0, 0, 0],
    ];
    this.width = 25;
    this.rects = [];

    this.init();
}

Map.prototype.getField = function () {
    return this.field;
}

Map.prototype.cellPosition = function (x, y) {
    var row = Math.floor(y / this.width);
    var col = Math.floor(x / this.width);
    return [col, row]
}

Map.prototype.cellCenterCoorinates = function(col, row) {
    var x = (col + 1) * this.width - this.width / 2;
    var y = (row + 1) * this.width - this.width / 2;
    return [x, y]
}

Map.prototype.drawRepresentation = function() {
    for(var row in this.rects)
        for (var col in this.rects[row])
            this.rects[row][col].fill(this.field[row][col]);
}

Map.prototype.init = function () {
    for ( var row = 0 ; row < this.field.length; row++ ) {
        this.rects[row] = [];
        for ( var col = 0; col < this.field[row].length; col++ ) {
            var weight = this.field[row][col];
            this.rects[row][col] = new Kinetic.Rect({
                x: col * this.width,
                y: row * this.width,
                width: this.width,
                height: this.width,
                fill: weight,
                stroke: 'black',
                strokeWidth: 1
            });
        }
    }

    for (var row in this.rects)
        for (var col in this.rects[row] )
            this.mapLayer.add(this.rects[row][col]);
}
