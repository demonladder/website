import React from 'react';
import Level from './Level';
import './References.css';

export default function({ tier }) {
    return (
        <div className='d-flex flex-fill tier-container'>
            <div className={`tier-label tier-${tier.tier} d-flex align-items-center`}>
                <p className='m-0 text-center'>Tier {tier.tier}</p>
            </div>
            <div className='py-2 levels'>
                {tier.levels.map(l => <Level level={l} key={l.ID} />)}
            </div>
        </div>
    );
}