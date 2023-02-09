import React from 'react';
import { Link } from 'react-router-dom';
import './Header.css';
import LoginButton from './routes/root/login/LoginButton';
import ProfileButton from './routes/root/login/ProfileButton';
//coolors.co/efa51c-998888-833a91-2c0e6c-191716

export default function Header({ userID }) {
    return (
        <header className='bg-gddl text-dark'>
            <div className='d-flex align-items-center'>
                <a href='/' className='h1 me-4 mb-0 text-decoration-none'>
                    GDDLadder
                </a>
            </div>
            <ul className='topnav'>
                <li>
                    <Link to='list' className='m-0 py-3 px-3 fs-5 fw-semibold gddl-bg-secondary btn-hover'>
                        The Ladder
                    </Link>
                </li>
                <li>
                    <Link to='references' className='m-0 py-3 px-3 fs-5 fw-semibold gddl-bg-secondary btn-hover'>
                        Reference Demons
                    </Link>
                </li>
                <li>
                    <Link to='packs' className='m-0 py-3 px-3 fs-5 fw-semibold gddl-bg-secondary btn-hover'>
                        Packs
                    </Link>
                </li>
            </ul>
        </header>
    );
}