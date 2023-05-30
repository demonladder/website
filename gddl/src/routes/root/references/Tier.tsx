import React from 'react';
import Level from './Level';
import { Tier } from './References';

type Props = {
    tier: Tier,
}

export default function({ tier }: Props) {
    return (
        <div className='d-flex flex-fill tier-container'>
            <div className={`tier-label tier-${tier.References[0].Tier} d-flex align-items-center`}>
                <p className='m-0 text-center'>Tier {tier.References[0].Tier}</p>
            </div>
            <div className='py-2 levels'>
                {tier.References.map(l => <Level level={l} key={'ref ' + l.ID} />)}
            </div>
        </div>
    );
}