import React from 'react';
import Level from './Level';

export default function({ tier: levels }) {
    return (
        <div className='d-flex flex-fill tier-container'>
            <div className={`tier-label tier-${levels[0].Tier} d-flex align-items-center`}>
                <p className='m-0 text-center'>Tier {levels[0].Tier}</p>
            </div>
            <div className='py-2 levels'>
                {levels.map(l => <Level level={l} key={'ref ' + l.ID} />)}
            </div>
        </div>
    );
}