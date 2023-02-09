import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import './Header.css';
import menu from './menu.svg';
import ProfileButtons from './routes/root/login/ProfileButtons';

export default function Header({ user }) {
    const [nav, setNav] = useState(false);
    function onMenuClick() {
        setNav(prev => !prev);
    }

    return (
        <div className='d-flex justify-content-between bg-gddl mb-4'>
            <div className={`text-dark topnav ${nav ? 'responsive' : ''}`} id='topnav'>
                    <a href='/' className='title me-4 mb-0 py-2 ps-3 text-decoration-none'>
                        GDDLadder
                    </a>
                    <Link to='list' className='m-0 h-100 py-3 px-3 fs-5 fw-semibold gddl-bg-secondary btn-hover'>
                        The Ladder
                    </Link>
                    <Link to='references' className='m-0 py-3 px-3 fs-5 fw-semibold gddl-bg-secondary btn-hover'>
                        Reference Demons
                    </Link>
                    <Link to='packs' className='m-0 py-3 px-3 fs-5 fw-semibold gddl-bg-secondary btn-hover'>
                        Packs
                    </Link>
                    <a href='javascript:void(0)' onClick={onMenuClick} className='icon m-0 py-3 px-4 fs-5 fw-semibold gddl-bg-secondary btn-hover'>
                        <img src={menu} alt='' className='h-100' />
                    </a>
            </div>
            <ProfileButtons user={user} />
        </div>
    );
}