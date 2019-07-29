import { addSetup, addUpdate, Canvas } from './visual.js';

var canvas: Canvas;

var width: number;
var height: number;

interface KeysHeld {
    [key: string]: boolean;
};

var keysHeld: KeysHeld = {};

// document.addEventListener('mousemove', (event) => {
//     x = event.x - offsetX;
//     y = event.y - offsetY;
// });

document.addEventListener('keydown', (event) => {
    keysHeld[event.key] = true;
});

document.addEventListener('keyup', (event) => {
    keysHeld[event.key] = false;
});

function setup() {
    canvas = new Canvas("canvas");

    resize();

    addUpdate(mainLoop);
}

function resize() {
    if (width != window.innerWidth || height != window.innerHeight) {
        console.warn('Expensive resize operation');
        width = window.innerWidth;
        height = window.innerHeight;
        canvas.resize(width, height);
    }
}

function draw() {
    canvas.clear();

    canvas.color('black');
    canvas.background();

    canvas.color('red');
    canvas.fillArc(200, 200, 100);
}

function mainLoop() {
    draw();
}

addSetup(setup);
