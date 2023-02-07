import React from 'react';
import Level from './Level';
import './References.css';

export default function({ tier }) {
    return (
        <div className='d-flex flex-fill tier-container'>
            <p className='m-0 my-auto mx-3'>Tier {tier.tier}</p>
            <div className='py-2'>
                {tier.levels.map(l => <Level level={l} key={l.ID} />)}
            </div>
        </div>
    );
}