import React from 'react';
import { Link } from 'react-router-dom';

export default function LoginButton() {
    return (
        <Link to='login' className='a align-middle px-3 py-2'>
            Log in
        </Link>
    );
}