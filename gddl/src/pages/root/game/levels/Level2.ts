import Block from '../Block';
import GameObject from '../GameObject';
import P5 from 'p5';

export default function createLevel2(p5: P5): GameObject[] {
    const objects: GameObject[] = [];

    const length = 300;
    const beginningOffset = 15;
    const w = 1.3;
    for (let i = 0; i < length; i++) {
        let h = (p5.noise(i / length * 12) - 0.5)*5 + 5;

        if (i === 0 || i == 199) {
            for (let j = 0; j < 12; j++) {
                objects.push(new Block(i+beginningOffset, h-w-j));
                objects.push(new Block(i+beginningOffset, h+w+j));
            }
        } else {
            objects.push(new Block(i+beginningOffset, h-w));
            //objects.push(new Block(i+beginningOffset, h-w-1));

            objects.push(new Block(i+beginningOffset, h+w));
            //objects.push(new Block(i+beginningOffset, h+w+1));
        }
    }
    
    return objects;
}