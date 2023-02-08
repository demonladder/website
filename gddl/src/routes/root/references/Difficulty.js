import React from 'react';
import Tier from './Tier';

export default function({ info }) {
    let tiers = [];

    for (let i = 0; i < info.tiers.length/5; i++) {
        tiers.push(info.tiers.slice(i*5, i*5+5));
    }
    console.log(tiers);

    return (
        <div className='flex-fill'>
            <div className={`tier-${(Math.ceil(info.minRange+info.maxRange)/2)} head`}>
                <h3 className='m-0 p-2 text-center'>{info.name}</h3>
            </div>
            <div className='d-flex'>
                {tiers.map(column => 
                    <div className='flex-fill'>
                        {column.map(t => <Tier tier={t} key={t.tier} />)}
                    </div>
                )}
            </div>
        </div>
    );
}