import React from 'react';

export default function Level({ level }) {
    return (
        <div className='px-2'>
            <span className='m-0'>{level.Name}</span>
        </div>
    );
}