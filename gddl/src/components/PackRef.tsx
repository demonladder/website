import React from 'react';
import { Link } from 'react-router-dom';
import { Pack } from '../api/packs';

export default function PackRef({ pack }: {pack: Pack}) {
    return (
        <Link to={`/pack/${pack.ID}`} className='pack-ref'>{pack.Name}</Link>
    );
}