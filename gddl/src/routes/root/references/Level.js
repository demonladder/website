import React from 'react';
import { Link } from 'react-router-dom';

export default function Level({ level }) {
    return (
        <div className='px-2 level-label'>
            <Link to={'/level/' + level.ID} className='m-0 underline'>{level.Name}</Link>
        </div>
    );
}