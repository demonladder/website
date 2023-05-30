import React, { useState } from 'react';
import { Container, Form, Nav, Navbar } from 'react-bootstrap';
import { LinkContainer } from 'react-router-bootstrap';
import ProfileButtons from './routes/root/login/ProfileButtons';
import LevelSearchBox from './components/LevelSearchBox';
import Modal, { Body, Footer } from './components/Modal';
import Select, { SelectOption } from './components/Select';
import { useMutation } from '@tanstack/react-query';
import { SendSubmission, SubmittableSubmission } from './api/submissions';
import LoadingSpinner from './components/LoadingSpinner';
import { StorageManager } from './storageManager';
import { useNavigate } from 'react-router-dom';
import { Level } from './api/levels';

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
    function closeSubmit() { setShowModal(false); }

    const [result, setResult] = useState<Level>();

    const [rating, setRating] = useState<number>(0);
    const [enjoyment, setEnjoyment] = useState(-1);
    const [refreshRate, setRefreshRate] = useState('');
    const [device, setDevice] = useState(1);
    const [proof, setProof] = useState('');

    function handleEnjoymentSelect(option: SelectOption) {
        setEnjoyment(option.key);
    }

    function handleDeviceSelect(option: SelectOption) {
        setDevice(option.key);
    }

    const sendSubmission = useMutation({
        mutationFn: SendSubmission,
        onSuccess: () => {
            closeSubmit();
        },
        onError: (error: any) => {
            setResponse(error.response.data.message);
        }
    });

    function submitForm(e: React.FormEvent) {
        e.preventDefault();
        e.stopPropagation();

        if (!result) {
            setResponse('Select a level!');
            return;
        }

        if (rating && (rating < 1 || rating > 35)) {
            setResponse('Rating must be between 1 and 35!');
            return;
        }

        if (proof && !proof.match(/https?:\/\/(www\.)?[-a-zA-Z0-9@:%._+~#=]{1,256}\.[a-zA-Z0-9()]{1,6}\b([-a-zA-Z0-9()@:%_+.~#?&//=]*)/)) {
            setResponse('Proof link is invalid!');
            return;
        }

        const data: SubmittableSubmission = {
            levelID: result.ID,
            rating: rating || 0,
            enjoyment: enjoyment || -1,
            refreshRate: parseInt(refreshRate.match(/([0-9]*)/)?.[0] || '') || 60,
            device: device,
            proof: proof,
        };
        console.log(data);
        
        sendSubmission.mutate(data);
    }

    const [responseMessage, setResponseMessage] = useState('');
    function setResponse(msg: string) {
        setResponseMessage(msg);
        setTimeout(() => {
            setResponseMessage('');
        }, 5000);
    }

    return (
        <>
            <Navbar expand='lg' className='py-4 px-5 mb-4'>
                <Container fluid>
                    <Navbar.Brand href='/' className='title'>GDDLadder</Navbar.Brand>
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
                    <Form noValidate onSubmit={submitForm} className='position-relative d-flex flex-column gap-2'>
                        <div className='row align-items-center mb-2'>
                            <div className='col-12 col-sm-4'>
                                <label>Level name: </label>
                            </div>
                            <div className='col-auto'>
                                <LevelSearchBox setResult={setResult} />
                            </div>
                        </div>
                        <div className='row align-items-center mb-2'>
                            <div className='col-12 col-sm-4'>
                                <label>Rating: </label>
                            </div>
                            <div className='col-auto'>
                                <input type='number' className='form-control' value={rating} onChange={(e: any) => setRating(e.target.value)} />
                            </div>
                        </div>
                        <div className='row align-items-center mb-2'>
                            <div className='col-12 col-sm-4'>
                                <label>Enjoyment: </label>
                            </div>
                            <div className='col-5'>
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
                                ]} onChange={handleEnjoymentSelect} zIndex={1030} />
                            </div>
                        </div>
                        <div className='row align-items-center mb-2'>
                            <div className='col-12 col-sm-4'>
                                <label>Refresh rate: </label>
                            </div>
                            <div className='col-auto'>
                                <input type='text' className='form-control' value={refreshRate} onChange={(e) => setRefreshRate(e.target.value)} />
                            </div>
                        </div>
                        <div className='row align-items-center mb-2'>
                            <div className='col-12 col-sm-4'>
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
                            <div className='col-12 col-sm-4'>
                                <label>Proof: </label>
                            </div>
                            <div className='col-8'>
                                <input type='text' className='form-control' value={proof} onChange={(e) => setProof(e.target.value)} />
                            </div>
                        </div>
                    </Form>
                </Body>
                <Footer>
                    <div className='d-flex justify-content-between'>
                        <span>{responseMessage}</span>
                        <div>
                            <LoadingSpinner isLoading={sendSubmission.isLoading} />
                            <button className='secondary' onClick={closeSubmit}>Close</button>
                            <button className='primary' type="submit" onClick={submitForm}>
                                Submit
                            </button>
                        </div>
                    </div>
                </Footer>
            </Modal>
        </>
    );
}