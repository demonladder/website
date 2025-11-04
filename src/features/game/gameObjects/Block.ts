import P5 from 'p5';
import { camOffset, pixelsPerBlock } from '../constants';
import GameObject from '../core/GameObject';
import GameState from '../GameState';
import { player } from '../Game';

export default class Block extends GameObject {
    constructor(x?: number, y?: number) {
        super(x, y);

        this.hitboxWidth = 1;
        this.hitboxHeight = 1;
        this.hitboxOffset.set(0, 1);
    }

    update(_p5: P5): void {}

    draw(p5: P5) {
        if (this.position.x < player.position.x - camOffset - 1) return;
        if (this.position.x > player.position.x + (p5.width / pixelsPerBlock - camOffset)) return;

        p5.strokeWeight(2);
        p5.fill(0);
        p5.stroke(255);

        const x = this.position.x;
        const y = this.position.y;
        const c = pixelsPerBlock;

        p5.rect(x * c, p5.height - (y + 1) * c, this.hitboxWidth * c, this.hitboxHeight * c);

        if (GameState.showHitboxes) {
            this.drawHitbox(p5);
        }
    }
}
