import React from 'react';
import './Creator.css';

export default function Creator({ name, disableLink }) {
    return (
        <>
            {disableLink ? <p className='m-0'>{name}</p>
                         : <a href={`/list/${name}`}>{name}</a>}
        </>
    )
}