import React from 'react';
import { Link } from 'react-router-dom';
import LoginButton from './LoginButton';

export default function ProfileButtons({ user }) {
    return (
        user ? <Link to={`/profile/${user.info.ID}`} className='p-3 pe-5 ms-auto'>
                    {user.info.Name }
                </Link>
        : <LoginButton />
    );
}