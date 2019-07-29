import { addSetup, addUpdate, Canvas } from './visual.js';
var canvas;
var width;
var height;
;
var keysHeld = {};
;
var controlMap = {
    MOVE: {
        'UP': 'w',
        'LEFT': 'a',
        'DOWN': 's',
        'RIGHT': 'd',
    },
    ATTACK: {
        'UP': 'i',
        'LEFT': 'j',
        'DOWN': 'k',
        'RIGHT': 'l',
    },
};
;
;
var player;
var enemies;
// document.addEventListener('mousemove', (event) => {
//     x = event.x - offsetX;
//     y = event.y - offsetY;
// });
document.addEventListener('keydown', function (event) {
    if (!player.attack) {
        var found = false;
        switch (event.key) {
            case controlMap.ATTACK.UP:
            case controlMap.ATTACK.LEFT:
            case controlMap.ATTACK.DOWN:
            case controlMap.ATTACK.RIGHT:
                found = true;
                break;
        }
        if (found) {
            player.attack = {
                direction: event.key,
                timeSince: 0,
            };
        }
    }
    keysHeld[event.key] = true;
});
document.addEventListener('keyup', function (event) {
    keysHeld[event.key] = false;
});
function setup() {
    canvas = new Canvas("canvas");
    resize();
    player = {
        position: { x: width / 2, y: height / 2 },
    };
    enemies = [];
    addUpdate(mainLoop);
}
function generateEntity() {
    return {
        position: {
            x: Math.random() * width,
            y: Math.random() * height,
        }
    };
}
function distance(e1, e2) {
    return Math.sqrt((e1.position.x - e2.position.x) * (e1.position.x - e2.position.x)
        + (e1.position.y - e2.position.y) * (e1.position.y - e2.position.y));
}
function attackPosition(player) {
    if (!player.attack) {
        return undefined;
    }
    var attack = {
        position: {
            x: player.position.x,
            y: player.position.y,
        }
    };
    switch (player.attack.direction) {
        case controlMap.ATTACK.UP:
            attack.position.y -= attackRadius;
            break;
        case controlMap.ATTACK.LEFT:
            attack.position.x -= attackRadius;
            break;
        case controlMap.ATTACK.DOWN:
            attack.position.y += attackRadius;
            break;
        case controlMap.ATTACK.RIGHT:
            attack.position.x += attackRadius;
            break;
    }
    return attack;
}
function resize() {
    if (width != window.innerWidth || height != window.innerHeight) {
        console.warn('Expensive resize operation');
        width = window.innerWidth;
        height = window.innerHeight;
        canvas.resize(width, height);
    }
}
var moveSpeed = 2;
var numEnemies = 10;
var attackDuration = 300;
var enemySpeed = 1.5;
var enemyRadius = 8;
var attackRadius = 30;
function update(dt) {
    if (player.attack) {
        player.attack.timeSince += dt;
        if (player.attack.timeSince >= attackDuration) {
            player.attack = undefined;
        }
    }
    while (enemies.length < numEnemies) {
        enemies.push(generateEntity());
    }
    if (keysHeld[controlMap.MOVE.LEFT]) {
        player.position.x -= moveSpeed;
    }
    if (keysHeld[controlMap.MOVE.RIGHT]) {
        player.position.x += moveSpeed;
    }
    if (keysHeld[controlMap.MOVE.UP]) {
        player.position.y -= moveSpeed;
    }
    if (keysHeld[controlMap.MOVE.DOWN]) {
        player.position.y += moveSpeed;
    }
    for (var _i = 0, enemies_1 = enemies; _i < enemies_1.length; _i++) {
        var enemy = enemies_1[_i];
        var dx = enemy.position.x - player.position.x;
        var dy = enemy.position.y - player.position.y;
        var dist = distance(enemy, player);
        enemy.position.x -= enemySpeed * dx / dist;
        enemy.position.y -= enemySpeed * dy / dist;
    }
    var attack = attackPosition(player);
    if (attack) {
        for (var i = enemies.length - 1; i >= 0; i--) {
            var enemy = enemies[i];
            if (distance(enemy, attack) < attackRadius + enemyRadius) {
                enemies.splice(i, 1);
            }
        }
    }
}
function draw() {
    canvas.clear();
    canvas.color('black');
    canvas.background();
    canvas.color('red');
    for (var _i = 0, enemies_2 = enemies; _i < enemies_2.length; _i++) {
        var enemy = enemies_2[_i];
        canvas.fillArc(enemy.position.x, enemy.position.y, enemyRadius);
    }
    canvas.color('lightblue');
    canvas.fillArc(player.position.x, player.position.y, 10);
    var attack = attackPosition(player);
    if (attack && player.attack) {
        canvas.color('rgba(255, 255, 255, ' + (1 - player.attack.timeSince / attackDuration) + ')');
        canvas.fillArc(attack.position.x, attack.position.y, attackRadius);
    }
}
function mainLoop(dt) {
    update(dt);
    draw();
}
addSetup(setup);
