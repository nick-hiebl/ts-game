import { addSetup, addUpdate, Canvas } from './visual.js';

var canvas: Canvas;

var width: number;
var height: number;

interface KeysHeld {
    [key: string]: boolean;
};

var keysHeld: KeysHeld = {};

interface ControlMap {
    MOVE: {
        UP: string;
        LEFT: string;
        DOWN: string;
        RIGHT: string;
    }
    ATTACK: {
        UP: string;
        LEFT: string;
        DOWN: string;
        RIGHT: string;
    }
};

const controlMap: ControlMap = {
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

interface Entity {
    position: {
        x: number, y: number
    }
};

interface Player extends Entity {
    attack?: Attack,
};

interface Attack {
    direction: string,
    timeSince: number,
}

var player: Player;

var enemies: Entity[];

// document.addEventListener('mousemove', (event) => {
//     x = event.x - offsetX;
//     y = event.y - offsetY;
// });

document.addEventListener('keydown', (event) => {
    if (!player.attack) {
        let found: boolean = false;
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

document.addEventListener('keyup', (event) => {
    keysHeld[event.key] = false;
});

function setup() {
    canvas = new Canvas("canvas");

    resize();

    player = {
        position: { x: width/2, y: height/2 },
    };
    enemies = [];

    addUpdate(mainLoop);
}

function generateEntity(): Entity {
    return {
        position: {
            x: Math.random() * width,
            y: Math.random() * height,
        }
    }
}

function distance(e1: Entity, e2: Entity): number {
    return Math.sqrt((e1.position.x - e2.position.x) * (e1.position.x - e2.position.x)
                   + (e1.position.y - e2.position.y) * (e1.position.y - e2.position.y));
}

function attackPosition(player: Player): Entity | undefined {
    if (!player.attack) {
        return undefined;
    }
    const attack: Entity = {
        position: {
            x: player.position.x,
            y: player.position.y,
        }
    }
    switch (player.attack.direction) {
        case controlMap.ATTACK.UP:
            attack.position.y -= attackRadius; break;
        case controlMap.ATTACK.LEFT:
            attack.position.x -= attackRadius; break;
        case controlMap.ATTACK.DOWN:
            attack.position.y += attackRadius; break;
        case controlMap.ATTACK.RIGHT:
            attack.position.x += attackRadius; break;
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

const moveSpeed = 2;
const numEnemies = 10;
const attackDuration = 300;
const enemySpeed = 1.5;
const enemyRadius = 8;
const attackRadius = 30;

function update(dt: number) {
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

    for (const enemy of enemies) {
        const dx = enemy.position.x - player.position.x;
        const dy = enemy.position.y - player.position.y;

        const dist = distance(enemy, player);
        enemy.position.x -= enemySpeed * dx / dist;
        enemy.position.y -= enemySpeed * dy / dist;
    }

    const attack = attackPosition(player);
    if (attack) {
        for (let i = enemies.length - 1; i >= 0; i--) {
            const enemy = enemies[i];
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
    for (const enemy of enemies) {
        canvas.fillArc(enemy.position.x, enemy.position.y, enemyRadius);
    }

    canvas.color('lightblue');
    canvas.fillArc(player.position.x, player.position.y, 10);

    const attack = attackPosition(player);
    if (attack && player.attack) {
        canvas.color('rgba(255, 255, 255, ' + (1 - player.attack.timeSince / attackDuration) + ')');
        canvas.fillArc(attack.position.x, attack.position.y, attackRadius);
    }
}

function mainLoop(dt: number) {
    update(dt);
    draw();
}

addSetup(setup);
