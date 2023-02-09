import React from 'react';
import { Link } from 'react-router-dom';

export default function ProfileButtons({ user }) {
    user = user || {};

    return (
         <Link to={`/profile/${user.ID}`} className='p-3 pe-5'>
            {user.Name || 'No user'}
         </Link>
    );
}