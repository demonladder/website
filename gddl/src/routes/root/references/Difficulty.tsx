import React from 'react';
import Tier from './Tier';
import { Difficulty } from './References';

type Props = {
    info: Difficulty,
}

export default function({ info }: Props) {
    const lowestTier = info.Tiers[0].Tier;
    const highestTier = info.Tiers[info.Tiers.length - 1].Tier;

    const tiersPerDiff = 5;

    const columns = [];
    while (info.Tiers.length > 0) {
        columns.push(info.Tiers.splice(0, tiersPerDiff));
    }

    return (
        <div>
            <div className={`tier-${Math.floor((highestTier + lowestTier)/2)} head`}>
                <h3 className='m-0 p-2 text-center'>{info.Name}</h3>
            </div>
            <div className='d-flex'>
                {
                    columns.map(c => <div className='d-flex flex-column'>
                        {
                            c.map(t => <Tier tier={t} key={'tier-' + t.Tier} />)
                        }
                    </div>)
                }
            </div>
        </div>
    );
}