import P5 from 'p5';
import Hitbox from './Hitbox';
import { pixelsPerBlock } from '../constants';

export default abstract class GameObject extends Hitbox {
    position: P5.Vector;

    constructor(x?: number, y?: number) {
        super();

        this.position = new P5.Vector(x, y);
    }

    inHitbox(other: GameObject) {
        if (Math.abs(this.position.x - other.position.x) > 3) return false;
        if (!this.enabled || !other.enabled) return false;

        return (
            this.position.x + this.hitboxOffset.x + this.hitboxWidth > other.position.x + other.hitboxOffset.x &&
            this.position.x + this.hitboxOffset.x < other.position.x + other.hitboxOffset.x + other.hitboxWidth &&  // This object is to the left of the other object
            this.position.y + this.hitboxOffset.y >= other.position.y + other.hitboxOffset.y - other.hitboxHeight &&
            this.position.y + this.hitboxOffset.y - this.hitboxHeight < other.position.y + other.hitboxOffset.y
        );
    }

    drawHitbox(p5: P5) {
        p5.noFill();
        p5.stroke(255, 0, 0);
        p5.strokeWeight(1);

        const c = pixelsPerBlock;
        p5.rect((this.position.x + this.hitboxOffset.x)*c, p5.height - (this.position.y + this.hitboxOffset.y)*c, this.hitboxWidth*c, this.hitboxHeight*c);
    }

    abstract update(p5: P5): void;
    abstract draw(p5: P5): void;
}