import P5 from 'p5';
import { pixelsPerBlock } from './constants';
import GameObject from './GameObject';
import GameState from './GameState';

export default class Block extends GameObject {
    constructor(x?: number, y?: number) {
        super(x, y);

        this.hitboxWidth = 1;
        this.hitboxHeight = 1;
        this.hitboxOffset.set(0, 1);
    }

    draw(p5: P5) {
        p5.strokeWeight(2);
        p5.fill(0);
        p5.stroke(255);

        const x = this.position.x;
        const y = this.position.y;
        const c = pixelsPerBlock;

        p5.rect(
            x*c, p5.height - (y+1)*c,
            this.hitboxWidth*c, this.hitboxHeight*c
        );

        if (GameState.showHitboxes) {
            this.drawHitbox(p5);
        }
    }
}