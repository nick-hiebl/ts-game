var Canvas = /** @class */ (function () {
    function Canvas(id) {
        var cnv = document.querySelector("canvas#" + id);
        if (cnv === null) {
            throw "Canvas with id: '" + id + "' could not be found.";
        }
        this.cnv = cnv;
        var ctx = this.cnv.getContext('2d');
        if (ctx === null) {
            throw "Could not create CanvasRenderingContext2D";
        }
        this.ctx = ctx;
        this.width = this.cnv.width;
        this.height = this.cnv.height;
    }
    Canvas.prototype.resize = function (width, height) {
        this.width = width;
        this.height = height;
        this.cnv.width = width;
        this.cnv.height = height;
    };
    Canvas.prototype.fillRect = function (x, y, width, height) {
        this.ctx.fillRect(x, y, width, height);
    };
    Canvas.prototype.strokeRect = function (x, y, width, height) {
        this.ctx.strokeRect(x, y, width, height);
    };
    Canvas.prototype.fillCRect = function (x, y, width, height) {
        this.ctx.fillRect(x - width / 2, y - height / 2, width, height);
    };
    Canvas.prototype.strokeCRect = function (x, y, width, height) {
        this.ctx.strokeRect(x - width / 2, y - height / 2, width, height);
    };
    Canvas.prototype.ellipse = function (x, y, width, height, rotation, start, end) {
        this.ctx.ellipse(x, y, width, height || width, rotation || 0, start || 0, end || 2 * Math.PI);
    };
    Canvas.prototype.fillArc = function (x, y, width, height, rotation, start, end) {
        this.ctx.beginPath();
        this.ellipse(x, y, width, height, rotation, start, end);
        this.ctx.fill();
    };
    Canvas.prototype.strokeArc = function (x, y, width, height, rotation, start, end) {
        this.ctx.beginPath();
        this.ellipse(x, y, width, height, rotation, start, end);
        this.ctx.stroke();
    };
    Canvas.prototype.fillSector = function (x, y, width, height, rotation, start, end) {
        this.ctx.beginPath();
        this.ellipse(x, y, width, height, rotation, start, end);
        this.ctx.lineTo(x, y);
        this.ctx.fill();
    };
    Canvas.prototype.line = function (x1, y1, x2, y2) {
        this.ctx.beginPath();
        this.ctx.moveTo(x1, y1);
        this.ctx.lineTo(x2, y2);
        this.ctx.stroke();
    };
    Canvas.prototype.background = function () {
        this.ctx.fillRect(0, 0, this.width, this.height);
    };
    Canvas.prototype.clear = function () {
        this.ctx.clearRect(0, 0, this.width, this.height);
    };
    Canvas.prototype.color = function (color) {
        this.ctx.fillStyle = color;
        this.ctx.strokeStyle = color;
    };
    Canvas.prototype.lineWidth = function (width) {
        this.ctx.lineWidth = width;
    };
    Canvas.prototype.filter = function (filter) {
        this.ctx.filter = filter;
    };
    Canvas.prototype.drawImage = function (image, dx, dy, dWidth, dHeight) {
        if (dWidth && dHeight) {
            this.ctx.drawImage(image, dx, dy, dWidth, dHeight);
        }
        this.ctx.drawImage(image, dx, dy);
    };
    Canvas.prototype.drawImageFrom = function (image, sx, sy, sWidth, sHeight, dx, dy, dWidth, dHeight) {
        this.ctx.drawImage(image, sx, sy, sWidth, sHeight, dx, dy, dWidth, dHeight);
    };
    Canvas.prototype.save = function () {
        this.ctx.save();
    };
    Canvas.prototype.restore = function () {
        this.ctx.restore();
    };
    Canvas.prototype.translate = function (x, y) {
        this.ctx.translate(x, y);
    };
    return Canvas;
}());
export { Canvas };
var SETUPS = [];
var UPDATES = [];
var started = false;
function beginLoop() {
    var lastFrame = Date.now();
    function loop() {
        var thisFrame = Date.now();
        var elapsed = thisFrame - lastFrame;
        window.requestAnimationFrame(loop);
        for (var _i = 0, UPDATES_1 = UPDATES; _i < UPDATES_1.length; _i++) {
            var update = UPDATES_1[_i];
            update(elapsed);
        }
        lastFrame = thisFrame;
    }
    window.requestAnimationFrame(loop);
}
export function addUpdate(f) {
    UPDATES.push(f);
}
export function addSetup(f) {
    SETUPS.push(f);
    if (started)
        f();
}
window.onload = function () {
    for (var _i = 0, SETUPS_1 = SETUPS; _i < SETUPS_1.length; _i++) {
        var s = SETUPS_1[_i];
        s();
    }
    started = true;
    beginLoop();
};
