import React from 'react';
import { tierToIcon } from '../../../components/DemonLogo.js';
import { Link, useNavigation } from 'react-router-dom';
import Cookies from 'js-cookie';

export default function ProfileButtons() {
    useNavigation();  // Used to re-render this component whenever location changes.
    
    const session = Cookies.get('session');
    if (!session) {
        localStorage.removeItem('csrf');
        return <LoginButton />
    }
    
    const user = localStorage.getItem('user');
    return <ProfileButton user={JSON.parse(user)} />;
}

function ProfileButton({ user }) {
    return (
        <Link to={`/profile/${user.ID}`} className='profile px-0'>
            <span className='fs-5'>{user.Name}</span>
            <img className='ms-3 pfp' src={tierToIcon(user.Hardest)} alt='' />
        </Link>
    );
}

function LoginButton() {
    return (
        <Link to='login' className='log-in align-middle me-5 ms-auto'>
            Log in
        </Link>
    );
}