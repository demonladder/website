import Sketch from 'react-p5';
import P5 from 'p5';
import Player from './Player';
import { camOffset, pixelsPerBlock } from './constants';
import GameObject from './GameObject';
import GameState from './GameState';
import createLevel2 from './levels/Level2';

export default function Game() {
    const player = new Player();
    const sceneObjects: GameObject[] = [];

    let lastObject = new GameObject();
    
    function setup(p5: P5, parent: Element) {
        p5.frameRate(60);
        
        p5.createCanvas(1280, 720).parent(parent);
        p5.background(0);

        sceneObjects.push(...createLevel2(p5));
        sceneObjects.push(player);

        sceneObjects.forEach((o) => {
            if (o.position.x > (lastObject?.position.x || 0)) {
                lastObject = o;
            }
        });
    }

    function draw(p5: P5) {
        p5.background(64);
        p5.stroke(255, 40);
        p5.strokeWeight(1);
        for (let y = 0; y < 12; y++) {
            p5.line(0, y*pixelsPerBlock, p5.width, y*pixelsPerBlock);
        }

        const minX = Math.floor(player.position.x - camOffset);  // Left most pixel in world coordinates
        const maxX = Math.ceil(player.position.x + ((p5.width - camOffset)));  // Right most pixel in world coordinates

        for (let x = minX; x < maxX; x++) {
            p5.line((x - player.position.x + camOffset)*pixelsPerBlock, 0, (x - player.position.x + camOffset)*pixelsPerBlock, p5.height);
        }
        
        player.translateCanvas(p5);
        sceneObjects.forEach((o) => {
            if (o.position.x < minX) return;
            if (o.position.x > maxX) return;

            o.draw(p5);
        });

        // Check colissions
        for (const obj of sceneObjects) {
            if (obj === player) continue;

            if (player.inHitbox(obj)) {
                player.isDead = true;
                p5.noLoop();
                break;
            }
        }

        player.unTranslateCanvas(p5);

        const percent = player.position.x / (lastObject.position.x + 5) * 100;
        p5.strokeWeight(3);
        p5.stroke(255);
        p5.fill(0);
        p5.textSize(60);
        const text = `${percent.toFixed(2)}%`;
        p5.text(text, 640 - p5.textWidth(text)/2, 50);
        if (percent > 100) p5.noLoop();
    }

    function mousePressed() {
        player.mouseChanged();
    }

    function mouseReleased() {
        player.mouseChanged();
    }

    function keyPressed(p5: P5) {
        switch(p5.key) {
            case 'r': {
                player.reset();
                p5.loop();
                break;
            }
            case 'h': {
                GameState.toggleHitboxes();
                break;
            }
        }
    }

    return (
        <>
            <Sketch className='grid place-items-center my-2 gap-2' setup={setup} draw={draw} mousePressed={mousePressed} mouseReleased={mouseReleased} keyPressed={keyPressed} />
            <p className='text-center'>R to restart</p>
        </>
    );
}

