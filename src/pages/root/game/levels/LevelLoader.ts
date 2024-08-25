import GameObject from '../GameObject';
import Spike from '../Spike';

interface FileObject {
    type: number;
    x: number;
    y: number;
}

export default async function loadLevel(levelName: string): Promise<GameObject[]> {
    const objects: GameObject[] = [];

    const file = await import(`./saved/${levelName}.json`) as { objects: FileObject[] };

    file.objects.forEach((o: FileObject) => {
        switch(o.type) {
            case 1: {
                objects.push(new Spike(o.x, o.y));
            }
        }
    });
    
    return objects;
}