import { useState } from 'react';
import ProfileButtons from './routes/root/login/ProfileButtons';
import SubmitModal from './components/SubmitModal';
import { Link, NavLink, useNavigate } from 'react-router-dom';
import { StorageManager } from './storageManager';
import UserSearchBox from './components/UserSearchBox';

export default function Header() {
    const [showModal, setShowModal] = useState(false);
    const [navOpen, setNavOpen] = useState(false);
    const navigate = useNavigate();
    function openSubmit() {
        // Check if user is logged in
        if (!StorageManager.hasSession()) {
            navigate('/login');
            return;
        }
        
        setShowModal(true);
    }

    return (
        <>
            <div className='bg-primary text-black flex items-center justify-between flex-wrap gap-x-8 px-16 py-8'>
                <div>
                    <Link to='/' className='font-bold text-3xl'>GDDLadder</Link>
                </div>
                <button className='xl:hidden' onClick={() => setNavOpen(prev => !prev)}>
                    <svg width='32px' height='32px' viewBox='0 0 32 32' stroke='currentColor' strokeWidth='2'>
                        <path d='M3 5h29M3 16h29M3 27h29' />
                    </svg>
                </button>
                <div className='basis-full xl:basis-auto grow max-xl:grid overflow-hidden transition-[grid-template-rows]' style={{ gridTemplateRows: navOpen ? '1fr' : '0fr' }}>
                    <div className='min-h-0 flex max-xl:flex-col justify-between'>
                        <div className='flex xl:items-center max-xl:flex-col gap-x-3 gap-y-1 text-xl'>
                            <div><NavLink to='/list' className={({ isActive }) => (isActive ? 'font-bold ' : '') + 'underline'}>The Ladder</NavLink></div>
                            <div><NavLink to='/references' className={({ isActive }) => (isActive ? 'font-bold ' : '') + 'underline'}>Reference Demons</NavLink></div>
                            <div><NavLink to='/packs' className={({ isActive }) => (isActive ? 'font-bold ' : '') + 'underline'}>Packs</NavLink></div>
                            {<button className='text-start fs-5 underline nav-link' onClick={openSubmit}>Submit</button>}
                            <UserSearchBox setResult={(user) => navigate('/profile/' + user.ID)} id='userSearch' />
                        </div>
                        <ProfileButtons />
                    </div>
                </div>
            </div>
            {<SubmitModal show={showModal} onClose={() => setShowModal(false)} />}
        </>
    );
}