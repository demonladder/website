import React from 'react';
import Tier from './Tier';
import { Reference } from '../../../api/references';

type Props = {
    references: Reference[],
    minTier: number,
    maxTier: number,
    name: string,
}

export default function Difficulty({ references, minTier, maxTier, name }: Props) {
    const tiersPerColumn = 5;

    const levels = references.filter((d) => d.Tier >= minTier && d.Tier <= maxTier);

    // Group into tiers
    const tiers: Reference[][] = [];
    for (let l of levels) {
        const index = l.Tier - minTier;
        if (tiers[index] === undefined) tiers[index] = [];
        tiers[index].push(l);
    }
    
    const columns: Reference[][][] = [];
    while (tiers.length > 0) {
        columns.push(tiers.splice(0, tiersPerColumn));
    }
    
    return (
        <div>
            <div className={`tier-${Math.floor((maxTier + minTier)/2)} head`}>
                <h3 className='m-0 p-2 text-center'>{name}</h3>
            </div>
            <div className='d-flex'>
                {
                    columns.map((c, i) => <div className='d-flex flex-column flex-grow-1' key={name + '-col-' + i}>
                        {
                            c.map(t => <Tier references={t} key={'tier-' + t[0].Tier} />)
                        }
                    </div>)
                }
            </div>
        </div>
    );
}