import Cookies from 'js-cookie';
import React, { useEffect, useRef, useState } from 'react';
import { Button, Container, Form, Modal, Nav, Navbar, Spinner } from 'react-bootstrap';
import { LinkContainer } from 'react-router-bootstrap';
import ProfileButtons from './routes/root/login/ProfileButtons';
import SearchResult from './routes/root/profile/SearchResult';
import serverIP from './serverIP';

export default function Header() {
    const [user, setUser] = useState({});
    useEffect(() => {
        if (!user.info) {
            const userID = Cookies.get('userID');
            if (!userID) return;
            fetch(`${serverIP}/getUser?userID=${userID}`).then(res => res.json())
            .then(data => {
                setUser(data);
            })
            .catch(e => {
                return {
                    error: true,
                    message: 'Couldn\'t connect to the server!'
                }
            });
        }
    });

    const [showModal, setShowModal] = useState(false);
    function closeSubmit() { setShowModal(false); }
    function openSubmit() { setShowModal(true); }

    const [levelName, setLevelName] = useState('');
    const [results, setResults] = useState([]);

    const [timer, setTimer] = useState();
    useEffect(() => {
        clearTimeout(timer);
        setTimer(setTimeout(() => {
            fetch(`${serverIP}/getLevels?page=0&chunk=5&name=${levelName}`, {
                credentials: 'include'
            }).then(res => res.json())
            .then(data => {
                setResults(data.levels);
            }).catch(e => {
                console.error(e);
            });
        }, 300));
    }, [levelName]);

    const [resultVisible, setResultVisible] = useState(false);
    function handleBlur() {
        setTimeout(() => {
            setResultVisible(false);
        }, 100);
    }

    const [clickedID, setClickedID] = useState(null);
    let rating = useRef();
    let enjoyment = useRef();
    let refreshRate = useRef();
    let device = useRef();
    let proof = useRef();

    const [sending, setSending] = useState(false);
    async function submitForm(e) {
        e.preventDefault();
        e.stopPropagation();

        if (levelName === '') {
            setResponse('Level name required!');
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



        // On validation
        let ID = null;
        if (results.length > 0) {
            ID = results[0].ID;
        }

        const data = {
            levelID: ID || clickedID,
            rating: parseInt(rating.current.value) || 0,
            enjoyment: parseInt(enjoyment.current.value),
            refreshRate: parseInt(refreshRate.current.value.match(/([0-9]*)/)[0]) || 60,
            device: parseInt(device.current.value),
            proof: proof.current.value
        };

        console.log(data);
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
                    <Navbar.Brand href='/' className='text-light title'>GDDLadder</Navbar.Brand>
                    <Navbar.Toggle aria-controls='navbar' />
                    <Navbar.Collapse id='navbar'>
                        <Nav className='me-auto' navbar>
                            <LinkContainer to='/list'><Nav.Link className='text-light'>The Ladder</Nav.Link></LinkContainer>
                            <LinkContainer to='/references'><Nav.Link className='text-light'>Reference Demons</Nav.Link></LinkContainer>
                            <LinkContainer to='/packs'><Nav.Link className='text-light'>Packs</Nav.Link></LinkContainer>
                            <LinkContainer to='/utils'><Nav.Link className='text-light'>Utils</Nav.Link></LinkContainer>
                            <Button variant='link' className='style-link px-3 fs-5' type='button' onClick={openSubmit}>Submit</Button>
                        </Nav>
                        <ProfileButtons user={user} />
                    </Navbar.Collapse>
                </Container>
            </Navbar>
            <Modal show={showModal} onHide={closeSubmit}>
                <Modal.Header>
                    <h1 className='moda-title fs-3 text-dark' id='modalTitle'>Submit rating</h1>
                    <button type='button' className='btn-close' onClick={closeSubmit}></button>
                </Modal.Header>
                <Modal.Body>
                    <Form noValidate onSubmit={submitForm} className='position-relative'>
                        <div className='row align-items-center mb-2'>
                            <div className='col-12 col-sm-3'>
                                <label className='text-dark'>Level name: </label>
                            </div>
                            <div className='col-auto'>
                                <input type='text' className='form-control' value={levelName} onChange={(e) => setLevelName(e.target.value)} onFocus={() => setResultVisible(true)} onBlur={handleBlur} required />
                            </div>
                        </div>
                        <div className={(resultVisible ? 'd-block' : 'd-none') + ' search-result border'} style={{ left: '25%' }}>
                            {results.map(r => <SearchResult level={r} setSearch={setLevelName} setID={setClickedID} key={r.ID} />)}
                        </div>
                        <div className='row align-items-center mb-2'>
                            <div className='col-12 col-sm-3'>
                                <label className='text-dark'>Rating: </label>
                            </div>
                            <div className='col-auto'>
                                <input type='number' className='form-control' ref={rating} />
                            </div>
                        </div>
                        <div className='row align-items-center mb-2'>
                            <div className='col-12 col-sm-3'>
                                <label className='text-dark'>Enjoyment: </label>
                            </div>
                            <div className='col-auto'>
                                <select className='form-select' ref={enjoyment}>
                                    <option value="0"></option>
                                    <option value="10">10 Masterpiece</option>
                                    <option value="9">9 Great</option>
                                    <option value="8">8 Very good</option>
                                    <option value="7">7 Good</option>
                                    <option value="6">6 Fine</option>
                                    <option value="5">5 Average</option>
                                    <option value="4">4 Bad</option>
                                    <option value="3">3 Very bad</option>
                                    <option value="2">2 Horrible</option>
                                    <option value="1">1 Appalling</option>
                                </select>
                            </div>
                        </div>
                        <div className='row align-items-center mb-2'>
                            <div className='col-12 col-sm-3'>
                                <label className='text-dark'>Refresh rate: </label>
                            </div>
                            <div className='col-auto'>
                                <input type='text' className='form-control' ref={refreshRate} />
                            </div>
                        </div>
                        <div className='row align-items-center mb-2'>
                            <div className='col-12 col-sm-3'>
                                <label className='text-dark'>Device: </label>
                            </div>
                            <div className='col-auto'>
                                <select className='form-select' ref={device}>
                                    <option value="1">PC</option>
                                    <option value="2">Mobile</option>
                                </select>
                            </div>
                        </div>
                        <div className='row align-items-center'>
                            <div className='col-12 col-sm-3'>
                                <label className='text-dark'>Proof: </label>
                            </div>
                            <div className='col-9'>
                                <input type='text' className='form-control' ref={proof} />
                            </div>
                        </div>
                    </Form>
                </Modal.Body>
                <Modal.Footer>
                    <span className='text-dark'>{responseMessage}</span>
                    <Button variant='secondary' onClick={closeSubmit}>Close</Button>
                    <Button variant='primary' type="submit" onClick={submitForm}>
                        {sending ? <Spinner as='span' animation='border' size='sm'  /> : ''}
                        Submit
                    </Button>
                </Modal.Footer>
            </Modal>
        </>
    );
}