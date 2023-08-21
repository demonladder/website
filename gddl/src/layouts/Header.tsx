import { useState } from 'react';
import ProfileButtons from '../pages/root/login/ProfileButtons';
import { Link, NavLink, useNavigate } from 'react-router-dom';
import UserSearchBox from '../components/UserSearchBox';
import { User } from '../api/users';

export default function Header() {
    const [navOpen, setNavOpen] = useState(false);
    const navigate = useNavigate();

    return (
        <header className='bg-primary text-black flex items-center justify-between flex-wrap gap-x-8 px-16 py-8'>
            <div>
                <Link to='/' className='font-bold text-3xl'>GDDLadder</Link>
            </div>
            <button className='2xl:hidden' onClick={() => setNavOpen(prev => !prev)}>
                <svg width='32px' height='32px' viewBox='0 0 32 32' stroke='currentColor' strokeWidth='2'>
                    <path d='M3 5h29M3 16h29M3 27h29' />
                </svg>
            </button>
            <div className='basis-full 2xl:basis-auto grow max-2xl:grid overflow-hidden transition-[grid-template-rows]' style={{ gridTemplateRows: navOpen ? '1fr' : '0fr' }}>
                <div className='min-h-0 flex max-2xl:flex-col justify-between'>
                    <nav className='flex 2xl:items-center max-2xl:flex-col gap-x-3 gap-y-1 text-xl'>
                        <div><NavLink to='/list' className={({ isActive }) => (isActive ? 'font-bold ' : '') + 'underline'}>The Ladder</NavLink></div>
                        <div><NavLink to='/references' className={({ isActive }) => (isActive ? 'font-bold ' : '') + 'underline'}>Reference Demons</NavLink></div>
                        <div><NavLink to='/packs' className={({ isActive }) => (isActive ? 'font-bold ' : '') + 'underline'}>Packs</NavLink></div>
                        <div><NavLink to='/about' className={({ isActive }) => (isActive ? 'font-bold ' : '') + 'underline'}>About</NavLink></div>
                        <NavLink to='/settings'><i className='bx bxs-cog text-2xl'></i></NavLink>
                    </nav>
                    <div className='flex items-center gap-4'>
                        <UserSearchBox<User> setResult={(user) => user && navigate('/profile/' + user.ID)} id='userSearch' />
                        <ProfileButtons />
                    </div>
                </div>
            </div>
        </header>
    );
}