import Cookies from 'js-cookie';
import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import menu from './icons/menu.svg';
import ProfileButtons from './routes/root/login/ProfileButtons';
import serverIP from './serverIP';

export default function Header() {
    const [nav, setNav] = useState(false);
    const [user, setUser] = useState({});
    useEffect(() => {
        if (!user.info) {
            const userID = Cookies.get('userID');
            if (!userID) return;
            fetch(`${serverIP}/getUser?userID=${userID}`).then(res => res.json())
            .then(data => {
                setUser(data);
            });
        }
    });


    function onMenuClick() {
        setNav(prev => !prev);
        return false;
    }

    return (
        <header className='d-flex justify-content-between mb-4 py-4 px-5'>
            <div className={`text-dark topnav w-100 ${nav ? 'responsive' : ''}`} id='topnav'>
                <a href='/' className='title me-4 mb-0 py-2 ps-3 text-decoration-none text-light'>
                    GDDLadder
                </a>
                <Link to='list' className='m-0 py-3 px-3 fs-5'>
                    The Ladder
                </Link>
                <Link to='references' className='m-0 py-3 px-3 fs-5'>
                    Reference Demons
                </Link>
                <Link to='packs' className='m-0 py-3 px-3 fs-5'>
                    Packs
                </Link>
                <ProfileButtons user={user} />
                <button onClick={onMenuClick} className='icon m-0 py-3 px-4 fs-5'>
                    <img src={menu} alt='' className='h-100 white' width='32px' />
                </button>
            </div>
        </header>
    );
}