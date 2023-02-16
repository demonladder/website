import React from 'react';
import { Link } from 'react-router-dom';
import { tierToIcon } from '../../../DemonLogo.js';

export default function ProfileButton({ user }) {
    return (
        <Link to={`/profile/${user.info.ID}`} className='profile pt-2 px-3 me-5 ms-auto'>
            <span>{user.info.Name }</span>
            <img className='ms-3 pfp' src={tierToIcon(user.info.Hardest)} alt='' />
        </Link>
    );
}