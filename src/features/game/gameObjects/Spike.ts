import P5 from 'p5';
import { pixelsPerBlock } from '../constants';
import GameObject from '../core/GameObject';
import GameState from '../GameState';

export default class Spike extends GameObject {
    constructor(x?: number, y?: number) {
        super(x, y);

        this.hitboxWidth = 0.15;
        this.hitboxHeight = 0.4;
        this.hitboxOffset.set(0.85/2, 0.7);
    }

    update(_p5: P5): void { }

    draw(p5: P5) {
        p5.strokeWeight(2);
        p5.fill(0);
        p5.stroke(255);

        const x = this.position.x;
        const y = this.position.y;
        const c = pixelsPerBlock;

        p5.triangle(
            x*c, p5.height - y*c,
            x*c + pixelsPerBlock/2, p5.height - (y*c + pixelsPerBlock),
            x*c + pixelsPerBlock, p5.height - y*c
        );

        if (GameState.showHitboxes) {
            this.drawHitbox(p5);
        }
    }
}