import React from 'react';
import Level from './Level';
import { Reference } from '../../../api/references';

type Props = {
    references: Reference[],
}

export default function({ references }: Props) {
    return (
        <div className='d-flex flex-fill tier-container'>
            <div className={`tier-label tier-${references[0].Tier} d-flex align-items-center`}>
                <p className='m-0 text-center'>Tier {references[0].Tier}</p>
            </div>
            <div className='py-2 levels'>
                {references.map(l => <Level level={l} key={'ref ' + l.ID} />)}
            </div>
        </div>
    );
}