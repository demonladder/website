//import map from '../../../../utils/map';
import Block from '../Block';
import GameObject from '../GameObject';
import P5 from 'p5';

export default function createLevel2(p5: P5): GameObject[] {
    const objects: GameObject[] = [];

    const length = 299;
    const beginningOffset = 15;
    const w = 1.45;
    const variance = 6.5;
    for (let i = 0; i < length; i++) {
        const h = (p5.noise(i / length * 12) - 0.5) * variance + variance;
        //const w = map(i / length, 0, 1, 1.3, 1.3);

        // Bottom
        objects.push(new Block(i + beginningOffset, h - w));

        // Top
        objects.push(new Block(i + beginningOffset, h + w));

        // Supports
        if (i % 5 === 0) {
            for (let j = 1; j < 10; j++) {
                const block1 = new Block(i + beginningOffset, h - w - j);
                if (i !== 0) block1.enabled = false;
                objects.push(block1);

                const block2 = new Block(i + beginningOffset, h + w + j);
                if (i !== 0) block2.enabled = false;
                objects.push(block2);
            }
        }
    }

    return objects;
}