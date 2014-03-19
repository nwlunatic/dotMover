var stage = new Kinetic.Stage({
    container: 'container',
    width: 800,
    height: 600
});

var mapLayer = new Kinetic.Layer();
var characterLayer = new Kinetic.Layer();

var map = new Map(mapLayer);
map.drawRepresentation();
var character = new Character(characterLayer);

stage.add(mapLayer);
stage.add(characterLayer);

var mapAnimation = new Kinetic.Animation( function(frame) {
    mapLayer.draw();
}, mapLayer);

var characterAnimation = new Kinetic.Animation(
    function(frame) {character._recalculate(frame)},
    characterLayer
);

mapAnimation.start();
characterAnimation.start();

var bfs = new BFSMethod();
mapLayer.on('click', function(event) {
    if (window.pathLine)
        window.pathLine.remove();

    function makePointsArray(path) {
        var points = [];

        for(var node in path) {
            var col = path[node][0];
            var row = path[node][1];
            var centerCoords = map.cellCenterCoorinates(col, row)
            points.push([centerCoords[0], centerCoords[1]]);
        }
        return points;
    }

    var startPoint = map.cellPosition(character.getPosition().x, character.getPosition().y);
    var endPoint = map.cellPosition(event.clientX, event.clientY);

    var field = deepCopy(map.field);
    var path = bfs.findPath(field, startPoint, endPoint, true);

    if (path) {
        path.unshift(startPoint);
        var points = makePointsArray(path);
        character.move(points);

        window.pathLine = new Kinetic.Line({
            x: startPoint.x,
            y: startPoint.y,
            points: Array.prototype.concat.apply([], points),
            stroke: 'green',
            strokeWidth: 2
        });

        mapLayer.add(pathLine);
    }
});
