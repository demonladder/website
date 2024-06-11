import P5 from 'p5';
import Trail from './Trail';
import { camOffset, pixelsPerBlock } from './constants';
import GameObject from './GameObject';
import GameState from './GameState';
import { keysPressed } from './Game';

enum Speed {
    Half = 8.37,
    Normal = 10.37,
    TwoX = 12.9,
    ThreeX = 15.59,
    FourX = 19.18,
}

export default class Player extends GameObject {
    velocity: P5.Vector;
    speed: Speed;
    prevMouseDown: boolean;
    isDead: boolean;

    radius: number;

    trail: Trail;

    // Events
    onDeath: ((player: Player) => void)[];

    constructor() {
        super(0, 6);

        this.speed = Speed.Normal,
            this.velocity = new P5.Vector(this.speed, 0);
        this.prevMouseDown = false;
        this.isDead = false;

        this.radius = 7 / pixelsPerBlock;  // Blocks
        this.hitboxWidth = 0.2;
        this.hitboxHeight = 0.2;
        this.hitboxOffset.set(-0.1, 0.1);

        this.trail = new Trail(this);

        this.onDeath = [];
    }

    reset() {
        this.position.set(0, 6);
        this.speed = Speed.Normal,
            this.velocity = new P5.Vector(this.speed, 0);
        this.trail = new Trail(this);
        this.isDead = false;
    }

    mouseChanged() {
        this.trail.addPoint();
    }

    die() {
        this.onDeath.forEach((f) => f(this));
        this.velocity.set(0, 0);
    }

    translateCanvas(p5: P5) {
        p5.translate(-(this.position.x - camOffset) * pixelsPerBlock, 0);
    }

    unTranslateCanvas(p5: P5) {
        p5.translate((this.position.x - camOffset) * pixelsPerBlock, 0);
    }

    update(p5: P5) {
        this.velocity.y = ((p5.mouseIsPressed || keysPressed[' '] === true) ? 1 : -1) * this.speed;

        if (!this.isDead) this.position.add(this.velocity.copy().div(60));

        let hasCollided = false;
        if (this.position.y < this.radius) {
            hasCollided = true;
            this.position.y = this.radius;
        } else if (this.position.y >= p5.height / pixelsPerBlock - this.radius) {
            hasCollided = true;
            this.position.y = p5.height / pixelsPerBlock - this.radius;
        }
        if (hasCollided) this.trail.addPoint();
    }

    draw(p5: P5) {
        // Draw player
        this.trail.draw(p5);
        p5.noFill();
        p5.circle(this.position.x * pixelsPerBlock, p5.height - this.position.y * pixelsPerBlock, this.radius * pixelsPerBlock * 2);

        if (GameState.showHitboxes) {
            this.drawHitbox(p5);
        }
    }
}