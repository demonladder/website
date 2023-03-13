import React from 'react';
import Tier from './Tier';

export default function({ info }) {
    const lowestTier = info.levels[0].Tier;
    const highestTier = info.levels[info.levels.length - 1].Tier;
    const tiers = [];
    for (let i = 0; i < highestTier-lowestTier+1; i++) tiers[i] = [];

    info.levels.forEach(l => {
        tiers[l.Tier - lowestTier].push(l);
    });

    const tiersPerDiff = 5;

    const columns = [];
    while (tiers.length > 0) {
        columns.push(tiers.splice(0, tiersPerDiff));
    }

    return (
        <div>
            <div className={`tier-${((highestTier + lowestTier)/2)} head`}>
                <h3 className='m-0 p-2 text-center'>{info.name}</h3>
            </div>
            <div className='d-flex'>
                {
                    columns.map(c => <div className='d-flex flex-column'>
                        {
                            c.map(t => <Tier tier={t} key={'tier-' + t[0].Tier} />)
                        }
                    </div>)
                }
            </div>
        </div>
    );
}