import P5 from 'p5';
import Player from './Player';
import { pixelsPerBlock } from './constants';

export default class Trail {
    points: P5.Vector[];
    player: Player;
    
    constructor(player: Player) {
        this.points = [player.position.copy()];
        this.player = player;
    }

    addPoint() {
        const latestPoint = this.points.at(-1);
        const secondLatestPoint = this.points.at(-2);
        // Latest point has same height as new point
        if (latestPoint?.y === this.player.position.y && secondLatestPoint?.y === this.player.position.y) {
            latestPoint.x = this.player.position.x;
        } else {
            this.points.push(this.player.position.copy());
        }
    }

    draw(p5: P5) {
        const all = [...this.points, this.player.position];
        this.points.forEach((p, i) => {
            p5.stroke(255);
            p5.strokeWeight(10);
            p5.line(p.x * pixelsPerBlock, p5.height - p.y*pixelsPerBlock, all[i+1].x*pixelsPerBlock, p5.height - all[i+1].y*pixelsPerBlock);
        });
    }
}