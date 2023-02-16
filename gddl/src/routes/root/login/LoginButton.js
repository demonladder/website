import React from 'react';
import { Link } from 'react-router-dom';

export default function LoginButton() {
    return (
        <Link to='login' className='log-in align-middle me-5 ms-auto'>
            Log in
        </Link>
    );
}