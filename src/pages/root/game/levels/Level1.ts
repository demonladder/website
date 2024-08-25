import GameObject from '../GameObject';
import Spike from '../Spike';

export default function createLevel1(): GameObject[] {
    const objects: GameObject[] = [];

    function w(num: number) {
        return num / 11;
    }

    const length = 105;
    for (let i = 0; i < length; i++) {
        // Bottom
        objects.push(new Spike(i, w(i) / 2));
        objects.push(new Spike(i + 0.5, w(i + 0.5) / 2));

        // Top
        objects.push(new Spike(i, 11 - w(i) / 2));
        objects.push(new Spike(i + 0.5, 11 - w(i + 0.5) / 2));
    }

    return objects;
}