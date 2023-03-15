import React, { useRef, useState } from 'react';
import { Button, Container, Form, Nav, Navbar, Spinner } from 'react-bootstrap';
import { LinkContainer } from 'react-router-bootstrap';
import { Link } from 'react-router-dom';
import ProfileButtons from './routes/root/login/ProfileButtons';
import serverIP from './serverIP';
import LevelSearchBox from './components/LevelSearchBox';
import Modal, { Body, Footer } from './components/Modal';
import Select from './components/Select';

export default function Header() {
    const [showModal, setShowModal] = useState(false);
    function closeSubmit() { setShowModal(false); }
    function openSubmit() { setShowModal(true); }

    const [result, setResult] = useState(null);

    let rating = useRef();
    const [enjoyment, setEnjoyment] = useState(-1);
    let refreshRate = useRef();
    const [device, setDevice] = useState(1);
    let proof = useRef();

    function handleEnjoymentSelect(option) {
        setEnjoyment(option.key);
    }

    function handleDeviceSelect(option) {
        setDevice(option.key);
    }

    const [sending, setSending] = useState(false);
    async function submitForm(e) {
        e.preventDefault();
        e.stopPropagation();

        if (!result) {
            setResponse('Click on a level!');
            return;
        }

        if (rating.current.value && (rating.current.value < 1 || rating.current.value > 35)) {
            setResponse('Rating must be between 1 and 35!');
            return;
        }

        if (proof.current.value && !proof.current.value.match(/https?:\/\/(www\.)?[-a-zA-Z0-9@:%._+~#=]{1,256}\.[a-zA-Z0-9()]{1,6}\b([-a-zA-Z0-9()@:%_+.~#?&//=]*)/)) {
            setResponse('Proof link is invalid!');
            return;
        }

        const data = {
            levelID: result.ID,
            rating: parseInt(rating.current.value) || 0,
            enjoyment: parseInt(enjoyment.current.value),
            refreshRate: parseInt(refreshRate.current.value.match(/([0-9]*)/)[0]) || 60,
            device: parseInt(device.current.value),
            proof: proof.current.value
        };

        setSending(true);
        
        fetch(`${serverIP}/submit`, {
            credentials: 'include',
            method: 'post',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(data)
        }).then(res => {
            setSending(false);

            res.json().then(data => setResponse(data.message));
        })
        .catch(e => {
            console.log('Error occurred');
            setSending(false);
        });
    }

    const [responseMessage, setResponseMessage] = useState('');
    function setResponse(msg) {
        setResponseMessage(msg);
        setTimeout(() => {
            setResponseMessage('');
        }, 5000);
    }

    return (
        <>
            <Navbar expand='lg' className='py-4 px-5 mb-4'>
                <Container fluid>
                    <Link to='/' className='navbar-brand title'>GDDLadder</Link>
                    <Navbar.Toggle aria-controls='navbar' />
                    <Navbar.Collapse id='navbar' className='justify-content-between'>
                        <Nav navbar>
                            <div className='d-flex align-items-center'><LinkContainer to='/list'><Nav.Link className='underline fs-5'>The Ladder</Nav.Link></LinkContainer></div>
                            <div className='d-flex align-items-center'><LinkContainer to='/references'><Nav.Link className='underline fs-5'>Reference Demons</Nav.Link></LinkContainer></div>
                            <div className='d-flex align-items-center'><LinkContainer to='/packs'><Nav.Link className='underline fs-5'>Packs</Nav.Link></LinkContainer></div>
                            <div className='d-flex align-items-center'><LinkContainer to='/utils'><Nav.Link className='underline fs-5'>Utils</Nav.Link></LinkContainer></div>
                            <div><button className='text-start fs-5 underline nav-link' onClick={openSubmit}>Submit</button></div>
                        </Nav>
                        <ProfileButtons />
                    </Navbar.Collapse>
                </Container>
            </Navbar>
            <Modal title='Submit rating' show={showModal} onHide={closeSubmit}>
                <Body>
                    <Form noValidate onSubmit={submitForm} className='position-relative'>
                        <div className='row align-items-center mb-2'>
                            <div className='col-12 col-sm-3'>
                                <label>Level name: </label>
                            </div>
                            <div className='col-auto'>
                                <LevelSearchBox setResult={setResult} />
                            </div>
                        </div>
                        <div className='row align-items-center mb-2'>
                            <div className='col-12 col-sm-3'>
                                <label>Rating: </label>
                            </div>
                            <div className='col-auto'>
                                <input type='number' className='form-control' ref={rating} />
                            </div>
                        </div>
                        <div className='row align-items-center mb-2'>
                            <div className='col-12 col-sm-3'>
                                <label>Enjoyment: </label>
                            </div>
                            <div className='col-4'>
                                <Select options={[
                                    { key: -1, value: '-' },
                                    { key: 0, value: '0 Abysmal' },
                                    { key: 1, value: '1 Appalling' },
                                    { key: 2, value: '2 Horrible' },
                                    { key: 3, value: '3 Very bad' },
                                    { key: 4, value: '4 Bad' },
                                    { key: 5, value: '5 Average' },
                                    { key: 6, value: '6 Fine' },
                                    { key: 7, value: '7 Good' },
                                    { key: 8, value: '8 Very good' },
                                    { key: 9, value: '9 Great' },
                                    { key: 10, value: '10 Masterpiece' }
                                ]} onChange={handleEnjoymentSelect} />
                            </div>
                        </div>
                        <div className='row align-items-center mb-2'>
                            <div className='col-12 col-sm-3'>
                                <label>Refresh rate: </label>
                            </div>
                            <div className='col-auto'>
                                <input type='text' className='form-control' ref={refreshRate} />
                            </div>
                        </div>
                        <div className='row align-items-center mb-2'>
                            <div className='col-12 col-sm-3'>
                                <label>Device: </label>
                            </div>
                            <div className='col-4'>
                                <Select options={[
                                    { key: 1, value: 'PC' },
                                    { key: 2, value: 'Mobile' }
                                ]} onChange={handleDeviceSelect} />
                            </div>
                        </div>
                        <div className='row align-items-center'>
                            <div className='col-12 col-sm-3'>
                                <label>Proof: </label>
                            </div>
                            <div className='col-9'>
                                <input type='text' className='form-control' ref={proof} />
                            </div>
                        </div>
                    </Form>
                </Body>
                <Footer>
                    <span className='text-dark'>{responseMessage}</span>
                    <Button variant='secondary' onClick={closeSubmit}>Close</Button>
                    <Button variant='primary' type="submit" onClick={submitForm}>
                        {sending ? <Spinner as='span' animation='border' size='sm'  /> : ''}
                        Submit
                    </Button>
                </Footer>
            </Modal>
        </>
    );
}