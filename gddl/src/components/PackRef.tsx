import React from 'react';
import { Link } from 'react-router-dom';
import { PackShell } from '../api/packs';

export default function PackRef({ pack }: {pack: PackShell}) {
    return (
        <Link to={`/pack/${pack.ID}`} className='pack-ref'>{pack.Name}</Link>
    );
}