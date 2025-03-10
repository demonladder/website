import Sketch from 'react-p5';
import P5 from 'p5';
import Player from './Player';
import { camOffset, pixelsPerBlock } from './constants';
import GameObject from './GameObject';
import GameState from './GameState';
import createLevel2 from './levels/Level2';
import { useEffect } from 'react';
import { PrimaryButton } from '../../../components/ui/buttons/PrimaryButton';

export const keysPressed: Record<string, boolean> = {};
export const player = new Player();
export default function Game() {
    let _p5: P5 | undefined;
    const sceneObjects: GameObject[] = [];

    let lastObject: GameObject;

    let startTime = 0;

    function setup(p5: P5, parent: Element) {
        if (!_p5) _p5 = p5;
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

        startTime = p5.millis();
    }

    function draw(p5: P5) {
        p5.background(64);
        p5.stroke(255, 40);
        p5.strokeWeight(1);
        for (let y = 0; y < 12; y++) {
            p5.line(0, y * pixelsPerBlock, p5.width, y * pixelsPerBlock);
        }

        const minX = Math.floor(player.position.x - camOffset);  // Left most pixel in world coordinates
        const maxX = Math.ceil(player.position.x + ((p5.width - camOffset)));  // Right most pixel in world coordinates

        for (let x = minX; x < maxX; x++) {
            p5.line((x - player.position.x + camOffset) * pixelsPerBlock, 0, (x - player.position.x + camOffset) * pixelsPerBlock, p5.height);
        }

        sceneObjects.forEach((o) => {
            o.update(p5);
        });

        player.translateCanvas(p5);
        sceneObjects.forEach((o) => {
            o.draw(p5);
        });
        player.unTranslateCanvas(p5);

        // Check colissions
        for (const obj of sceneObjects) {
            if (obj === player) continue;

            if (player.inHitbox(obj)) {
                player.isDead = true;
                p5.noLoop();

                break;
            }
        }

        const percent = player.position.x / (lastObject.position.x + 5) * 100;
        p5.strokeWeight(5);
        p5.stroke(0);
        p5.fill(255);
        p5.textSize(60);
        const text = `${percent.toFixed(2)}%`;
        p5.text(text, 640 - p5.textWidth(text) / 2, 50);
        if (percent > 100) {
            p5.text((p5.millis() - startTime > 33200) ? 'You fail' : 'You win', 0, 50);

            p5.noLoop();
        }
    }

    function mousePressed() {
        player.mouseChanged();
    }

    function mouseReleased() {
        player.mouseChanged();
    }

    function keyPressed(p5: P5) {
        switch (p5.key) {
            case 'r': {
                restart(p5);
                break;
            }
            case 'h': {
                GameState.toggleHitboxes();
                break;
            }
        }

        switch (p5.key) {
            case 'ArrowUp':
            case ' ': {
                keysPressed[' '] = true;
                player.mouseChanged();
                break;
            }
        }
    }

    function restart(p5?: P5) {
        player.reset();
        if (!p5) return;
        p5.loop();
        startTime = p5.millis();
    }

    function keyReleased(p5: P5) {
        switch (p5.key) {
            case 'ArrowUp':
            case ' ': {
                keysPressed[' '] = false;
                player.mouseChanged();
                break;
            }
        }
    }

    // Mount and dismount space press preventer
    useEffect(() => {
        function eventListener(e: KeyboardEvent) {
            e.preventDefault();
        }

        document.addEventListener('keydown', eventListener);

        return () => {
            document.removeEventListener('keydown', eventListener);
        }
    }, []);

    return (
        <>
            <Sketch className='grid place-items-center my-2 gap-2' setup={setup} draw={draw} mousePressed={mousePressed} mouseReleased={mouseReleased} keyPressed={keyPressed} keyReleased={keyReleased} />
            <div className='flex justify-center'>
                <PrimaryButton onClick={() => restart(_p5)}>R to restart</PrimaryButton>
            </div>
        </>
    );
}

