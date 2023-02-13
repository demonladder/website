import React from 'react';
import { Link } from 'react-router-dom';
import LoginButton from './LoginButton';

export default function ProfileButtons({ user }) {
    user = user || {};

    return (
         <Link to={`/profile/${user.ID}`} className='p-3 pe-5 ms-auto'>
            {user.Name || <LoginButton /> }
         </Link>
    );
}