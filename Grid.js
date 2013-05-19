/**
 * Created with JetBrains WebStorm.
 * User: lunatic
 * Date: 5/18/13
 * Time: 10:03 AM
 * To change this template use File | Settings | File Templates.
 */

function Grid(context) {
    this.step = 20;
    if (!context)
        throw new Error("empty context");
    this.context = context;
    this.color = "rgb(0,255,0)";

    console.log();

    this.draw = function () {
        this.context.fillStyle = this.color;

        var width = this.context.canvas.width,
            height = this.context.canvas.height;

        console.log("drawing grid");

        for (var x = this.step, y = this.context.height; x <= width; x += this.step) {
            this.context.beginPath();
            this.context.moveTo(x, 0);
            this.context.lineTo(x, height);
            this.context.lineWidth = 1;
            this.context.stroke();
        }

        for (var x = this.context.width, y = this.step; y <= height; y += this.step) {
            this.context.beginPath();
            this.context.moveTo(0, y);
            this.context.lineTo(width, y);
            this.context.lineWidth = 1;
            this.context.stroke();
        }

    };
};