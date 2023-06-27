import React, { useState } from 'react';
import { Container, Nav, Navbar } from 'react-bootstrap';
import ProfileButtons from './routes/root/login/ProfileButtons';
import SubmitModal from './components/SubmitModal';
import { Link, NavLink, useNavigate } from 'react-router-dom';
import { StorageManager } from './storageManager';
import UserSearchBox from './components/UserSearchBox';

export default function Header() {
    const [showModal, setShowModal] = useState(false);
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
            <Navbar expand='xxl' className='py-4 px-5' >
                <Container fluid>
                    <Navbar.Brand><Link to='/' className='title'>GDDLadder</Link></Navbar.Brand>
                    <Navbar.Toggle aria-controls='navbar' color='black'>
                        <svg width='30px' height='30px' viewBox='0 0 30 30' stroke='black' strokeWidth='2'>
                            <path d='M4 7h22M4 15h22M4 23h22' />
                        </svg>
                    </Navbar.Toggle>
                    <Navbar.Collapse id='navbar'>
                        <Nav navbar className='me-auto gap-2 gap-xxl-3'>
                            <div><NavLink to='/list' className='underline'>The Ladder</NavLink></div>
                            <div><NavLink to='/references' className='underline'>Reference Demons</NavLink></div>
                            <div><NavLink to='/packs' className='underline'>Packs</NavLink></div>
                            {/* {<button className='text-start fs-5 underline nav-link' onClick={openSubmit}>Submit</button>} */}
                            <UserSearchBox setResult={(user) => navigate('/profile/' + user.ID)} id='userSearch' />
                        </Nav>
                        <ProfileButtons />
                    </Navbar.Collapse>
                </Container>
            </Navbar>
            {/* {<SubmitModal show={showModal} onClose={() => setShowModal(false)} />} */}
        </>
    );
}