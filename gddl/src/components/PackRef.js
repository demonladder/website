import React from 'react';
import { Link } from 'react-router-dom';

export default function PackRef({ pack }) {
    return (
        <Link to={`/pack/${pack.ID}`} className='pack-ref'>{pack.Name}</Link>
    );
}