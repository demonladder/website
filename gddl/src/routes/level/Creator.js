import React from 'react';
import './Creator.css';

export default function Creator({ name, callback, disableLink }) {
    function namePressed() {
        callback(name);
    }

    return (
        <>
            {disableLink ? <p className='m-0'>{name}</p>
                         : <button className='style-link' onClick={namePressed}>{name}</button>}
        </>
    )
}