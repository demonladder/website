import React from 'react';
import { Link } from 'react-router-dom';

export default function Creator({ name, disableLink }) {
    return (
        <>
            {disableLink ? <p className='m-0'>{name}</p>
                                 : <Link to='/'>{name}</Link>}
        </>
    )
}