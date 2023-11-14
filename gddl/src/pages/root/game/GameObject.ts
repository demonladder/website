import P5 from 'p5';
import Hitbox from './Hitbox';
import { pixelsPerBlock } from './constants';

export default class GameObject extends Hitbox {
    position: P5.Vector;

    constructor(x?: number, y?: number) {
        super();

        this.position = new P5.Vector(x, y);
    }

    inHitbox(other: GameObject) {
        const posA = P5.Vector.add(this.position, this.hitboxOffset);
        const posB = P5.Vector.add(other.position, other.hitboxOffset);
        
        return (
            posA.x + this.hitboxWidth > posB.x &&
            posA.x < posB.x + other.hitboxWidth &&  // This object is to the left of the other object
            posA.y >= posB.y - other.hitboxHeight &&
            posA.y - this.hitboxHeight < posB.y
        );
    }

    drawHitbox(p5: P5) {
        p5.noFill();
        p5.stroke(255, 0, 0);
        p5.strokeWeight(1);

        const c = pixelsPerBlock;
        p5.rect((this.position.x + this.hitboxOffset.x)*c, p5.height - (this.position.y + this.hitboxOffset.y)*c, this.hitboxWidth*c, this.hitboxHeight*c);
    }

    draw(_p5: P5) {}
}