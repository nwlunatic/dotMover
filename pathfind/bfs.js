function BFSMethod() {}

BFSMethod.prototype.Node = function (position, parent) {
    this.position = position;
    this.parent = parent;
}

BFSMethod.prototype._set_node_visited = function (field, node) {
    field[node.position[1]][node.position[0]] = 'cyan'; // make it visited
}

BFSMethod.prototype._find_free_neigbours = function(field, pos, neighbours_directions) {
    var neighbours = [];
    for (var i = 0; i < neighbours_directions.length; i++) {
        var neighbour_col = pos[0] + neighbours_directions[i][0];
        var neighbour_row = pos[1] + neighbours_directions[i][1];

        if ( neighbour_row < 0 || neighbour_row >= field.length )
            continue;
        if ( neighbour_col < 0 || neighbour_col >= field[neighbour_row].length )
            continue;

        if (field[neighbour_row][neighbour_col] === 0)
            neighbours.push([neighbour_col, neighbour_row]);
    }
    return neighbours;
}

BFSMethod.prototype._get_neighbours = function (field, node, with_diagonals) {
    if (typeof (with_diagonals) === 'undefined')
        with_diagonals = false;

    function have_free_side_neighbour(pos, neighbour, side_neighbours){
        var direction = [neighbour[0] - pos[0], neighbour[1] - pos[1]];
        var have_horizontal = side_neighbours.map(function(neighbour) {return neighbour[0];}).indexOf(pos[0] + direction[0]) > -1;
        var have_vertical = side_neighbours.map(function(neighbour) {return neighbour[1];}).indexOf(pos[1] + direction[1]) > -1;
        return have_horizontal && have_vertical;
    }

    var col = node.position[0];
    var row = node.position[1];
    var side_directions = [[-1,0],[1,0],[0,-1],[0,1]];
    var diagonal_directions = [[-1,-1],[-1,1],[1,1],[1,-1]];

    var _neighbours = this._find_free_neigbours(field, [col, row], side_directions);

    if (with_diagonals) {
        var diagonal_neighbours = this._find_free_neigbours(field, [col, row], diagonal_directions);
        diagonal_neighbours = diagonal_neighbours.filter(function(n){
            return have_free_side_neighbour(node.position, n, _neighbours);
        });
        _neighbours = _neighbours.concat(diagonal_neighbours);
    }

    var neighbours = _neighbours.map(
        function(neighbour) {return new this.Node(neighbour, undefined);},
        this
    );
    delete _neighbours;

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