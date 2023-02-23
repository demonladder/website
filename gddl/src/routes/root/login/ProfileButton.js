import React from 'react';
import { tierToIcon } from '../../../components/DemonLogo.js';

export default function ProfileButton({ user }) {
    return (
        <a href={`/profile/${user.info.ID}`} className='profile pt-2 px-3 me-5 ms-auto'>
            <span>{user.info.Name }</span>
            <img className='ms-3 pfp' src={tierToIcon(user.info.Hardest)} alt='' />
        </a>
    );
}