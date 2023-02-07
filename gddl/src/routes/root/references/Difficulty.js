import React from 'react';
import Tier from './Tier';

export default function({ info }) {
    return (
        <div className='mx-2'>
            <div>
                <h3>{info.name}</h3>
            </div>
            {info.tiers.map(t => <Tier tier={t} key={t.tier} />)}
        </div>
    );
}