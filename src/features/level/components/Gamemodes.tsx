import { Heading2 } from '../../../components/headings';
import { getLevelGamemodes } from '../api/getLevelGamemodes.ts';
import { InfoCircle } from '@boxicons/react';
import Tooltip from '../../../components/ui/Tooltip.tsx';

function portalIdToColorClass(id: number) {
    switch (id) {
        default:
        case 12:
            return 'bg-green-400';
        case 13:
            return 'bg-purple-400';
        case 47:
            return 'bg-red-400';
        case 111:
            return 'bg-orange-400';
        case 660:
            return 'bg-teal-300';
        case 745:
            return 'bg-white';
        case 1331:
            return 'bg-purple-500';
    }
}

function portalIdToTitle(id: number) {
    switch (id) {
        default:
        case 12:
            return 'Cube';
        case 13:
            return 'Ship';
        case 47:
            return 'Ball';
        case 111:
            return 'UFO';
        case 660:
            return 'Wave';
        case 745:
            return 'Robot';
        case 1331:
            return 'Spider';
    }
}

export function Gamemodes() {
    const exampleData = getLevelGamemodes();

    return (
        <section className='mt-6'>
            <Heading2 className='flex gap-2'>
                <Tooltip label='These graphs show the approximate gamemode changes throughout the level. It is far from perfect.'>
                    <InfoCircle size='md' />
                </Tooltip>
                Game modes
            </Heading2>
            <p>By distance</p>
            <div>
                {exampleData.slice(0, -1).map((mode, i) => (
                    <span
                        className={'inline-block h-4 ' + portalIdToColorClass(mode.id)}
                        style={{ width: `${(exampleData.at(i + 1)!.x - mode.x) * 100}%` }}
                        title={portalIdToTitle(mode.id)}
                        key={i}
                    />
                ))}
            </div>
            <p>By time</p>
            <div>
                {exampleData.slice(0, -1).map((mode, i) => (
                    <span
                        className={'inline-block h-4 ' + portalIdToColorClass(mode.id)}
                        style={{ width: `${((exampleData.at(i + 1)!.t - mode.t) / exampleData.at(-1)!.t) * 100}%` }}
                        title={portalIdToTitle(mode.id)}
                        key={i}
                    />
                ))}
            </div>
        </section>
    );
}
