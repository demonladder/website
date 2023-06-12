import React, { useState } from 'react';
import { Container, Nav, Navbar } from 'react-bootstrap';
import { LinkContainer } from 'react-router-bootstrap';
import ProfileButtons from './routes/root/login/ProfileButtons';
import SubmitModal from './components/SubmitModal';
import { useNavigate } from 'react-router-dom';
import { StorageManager } from './storageManager';

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
            <Navbar expand='lg' className='py-4 px-5 mb-4'>
                <Container fluid>
                    <Navbar.Brand href='/' className='title'>GDDLadder</Navbar.Brand>
                    <Navbar.Toggle aria-controls='navbar' />
                    <Navbar.Collapse id='navbar'>
                        <Nav navbar className='me-auto'>
                            <div className='d-flex align-items-center'><LinkContainer to='/list'><Nav.Link className='underline fs-5'>The Ladder</Nav.Link></LinkContainer></div>
                            <div className='d-flex align-items-center'><LinkContainer to='/references'><Nav.Link className='underline fs-5'>Reference Demons</Nav.Link></LinkContainer></div>
                            <div className='d-flex align-items-center'><LinkContainer to='/packs'><Nav.Link className='underline fs-5'>Packs</Nav.Link></LinkContainer></div>
                            <div className='d-flex align-items-center'><LinkContainer to='/utils'><Nav.Link className='underline fs-5'>Utils</Nav.Link></LinkContainer></div>
                            <button className='text-start fs-5 underline nav-link' onClick={openSubmit}>Submit</button>
                        </Nav>
                        <ProfileButtons />
                    </Navbar.Collapse>
                </Container>
            </Navbar>
            <SubmitModal show={showModal} onClose={() => setShowModal(false)} />
        </>
    );
}