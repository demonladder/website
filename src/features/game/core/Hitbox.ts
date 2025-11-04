import P5 from 'p5';

export default class Hitbox {
    hitboxWidth: number;
    hitboxHeight: number;
    enabled: boolean;

    readonly hitboxOffset: P5.Vector;

    constructor(enabled = true) {
        this.hitboxWidth = 0.5;
        this.hitboxHeight = 0.5;
        this.enabled = enabled;

        this.hitboxOffset = new P5.Vector();
    }
}
