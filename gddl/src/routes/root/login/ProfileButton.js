import React from 'react';
import { tierToIcon } from '../../../components/DemonLogo.js';
import { Link } from 'react-router-dom';

export default function ProfileButton({ user }) {
    return (
        <Link to={`/profile/${user.info.ID}`} className='profile px-0'>
            <span>{user.info.Name }</span>
            <img className='ms-3 pfp' src={tierToIcon(user.info.Hardest)} alt='' />
        </Link>
    );
}