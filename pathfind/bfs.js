function BFSMethod() {}

BFSMethod.prototype.Node = function (position, parent) {
    this.position = position;
    this.parent = parent;
}

BFSMethod.prototype._set_node_visited = function (field, node) {
    field[node.position[1]][node.position[0]] = 'cyan'; // make it visited
}

BFSMethod.prototype._look_directions = function(field, pos, neighbours_directions) {
    var neighbours = [];
    for (var i = 0; i < neighbours_directions.length; i++) {
        var neighbour_col = pos[0] + neighbours_directions[i][0];
        var neighbour_row = pos[1] + neighbours_directions[i][1];

        if ( neighbour_row < 0 || neighbour_row >= field.length )
            continue;
        if ( neighbour_col < 0 || neighbour_col >= field[neighbour_row].length )
            continue;

        if (field[neighbour_row][neighbour_col] === 0)
            neighbours.push(new this.Node([neighbour_col, neighbour_row], undefined));
    }
    return neighbours;
}

BFSMethod.prototype._get_neighbours = function (field, node, with_diagonals) {
    if (typeof (with_diagonals) === 'undefined')
        with_diagonals = false;

    var col = node.position[0];
    var row = node.position[1];
    var standard_neighbours = [[-1,0],[1,0],[0,-1],[0,1]];
    var diagonal_neighbours = [[-1,-1],[-1,1],[1,1],[1,-1]];

    var neighbours = this._look_directions(field, [col, row], standard_neighbours);

    if (with_diagonals) {
        var diagonal_neighbours = this._look_directions(field, [col, row], diagonal_neighbours);
        neighbours = neighbours.concat(diagonal_neighbours);
    }

    return neighbours;
}

BFSMethod.prototype._get_ancestry = function (node) {
    var ancestors = [];
    while( node.parent != null ) {
        ancestors.push([node.position[0], node.position[1]]);
        node = node.parent;
    }
    ancestors.reverse();
    return ancestors;
}

BFSMethod.prototype.findPath = function (field, startCell, endCell, with_diagonals) {
    var queue = [];
    queue.push(new this.Node(startCell, null));
    search:
    while ( queue.length > 0 ) {
        var node = queue.shift();
        this._set_node_visited(field, node);
        var neighbours = this._get_neighbours(field, node, with_diagonals);
        while ( neighbours.length > 0) {
            var neighbour = neighbours.shift();
            neighbour.parent = node;
            if (neighbour.position[0] == endCell[0] && neighbour.position[1] == endCell[1]) {
                break search;
            } else {
                queue.push(neighbour);
            }
        }
    }

    if (neighbour.position[0] == endCell[0] && neighbour.position[1] == endCell[1])
        return this._get_ancestry(neighbour);
    else
        return false;
}