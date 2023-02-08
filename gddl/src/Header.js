import React from 'react';
import { Link } from 'react-router-dom';
import './Header.css';
import LoginButton from './routes/root/login/LoginButton';
import ProfileButton from './routes/root/login/ProfileButton';
//coolors.co/efa51c-998888-833a91-2c0e6c-191716

export default function Header({ userID }) {
    return (
        <header className='bg-gddl text-dark'>
            <div className='container py-4 d-flex justify-content-between'>
                <div className='d-flex'>
                    <a href='/' className='h1 me-4 text-decoration-none'>
                        GDDLadder
                    </a>
                    <div className='d-flex align-items-end'>
                        <Link to='list' className='my-2 nav text-dark'>
                            The Ladder
                        </Link>
                        <Link to='references' className='my-2 nav text-dark'>
                            Reference Demons
                        </Link>
                        <Link to='packs' className='my-2 nav text-dark'>
                            Packs
                        </Link>
                    </div>
                </div>
                <div className='align-self-center d-flex'>
                    {userID ? <ProfileButton userID={userID} />
                    : <LoginButton />}
                </div>
            </div>
        </header>
    );
}