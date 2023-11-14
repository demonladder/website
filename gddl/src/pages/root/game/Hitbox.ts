import P5 from 'p5';

export default class Hitbox {
    hitboxWidth: number;
    hitboxHeight: number;

    readonly hitboxOffset: P5.Vector;

    constructor() {
        this.hitboxWidth = 0.5;
        this.hitboxHeight = 0.5;

        this.hitboxOffset = new P5.Vector();
    }
}