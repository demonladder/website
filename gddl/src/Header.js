import Cookies from 'js-cookie';
import React, { useEffect, useRef, useState } from 'react';
import { Button, Modal } from 'react-bootstrap';
import { Form, Link } from 'react-router-dom';
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
            })
            .catch(e => {
                return {
                    error: true,
                    message: 'Couldn\'t connect to the server!'
                }
            });
        }
    });


    function onMenuClick() {
        setNav(prev => !prev);
        return false;
    }

    const [showModal, setShowModal] = useState(false);
    function closeSubmit() { setShowModal(false); }
    function openSubmit() { setShowModal(true); }

    let levelName = useRef();
    let rating = useRef();
    let enjoyment = useRef();
    let refreshRate = useRef();
    let device = useRef();
    let proof = useRef();
    async function submitForm() {
        const data = {
            name: levelName.current.value,
            rating: parseInt(rating.current.value) || 0,
            enjoyment: parseInt(enjoyment.current.value),
            refreshRate: parseInt(refreshRate.current.value.match(/([0-9]*)/)[0]) || 60,
            device: parseInt(device.current.value),
            proof: proof.current.value
        };

        console.log(data);
    }

    return (
        <>
            <header className='d-flex justify-content-between mb-4 py-4 px-5'>
                <div className={`text-dark topnav w-100 ${nav ? 'responsive' : ''}`} id='topnav'>
                    <a href='/' className='title me-4 mb-0 py-2 ps-3 text-decoration-none text-light'>
                        GDDLadder
                    </a>
                    <Link to='/list' className='m-0 py-3 px-3 fs-5'>
                        The Ladder
                    </Link>
                    <Link to='/references' className='m-0 py-3 px-3 fs-5'>
                        Reference Demons
                    </Link>
                    <Link to='/packs' className='m-0 py-3 px-3 fs-5'>
                        Packs
                    </Link>
                    <button className='style-link px-3 fs-5' type='button' onClick={openSubmit}>Submit</button>
                    <ProfileButtons user={user} />
                    <button onClick={onMenuClick} className='icon m-0 py-3 px-4 fs-5'>
                        <img src={menu} alt='' className='h-100 white' width='32px' />
                    </button>
                </div>
            </header>
            <Modal show={showModal} onHide={closeSubmit}>
                <Modal.Header>
                    <h1 className='moda-title fs-3 text-dark' id='modalTitle'>Submit rating</h1>
                    <button type='button' className='btn-close' onClick={closeSubmit}></button>
                </Modal.Header>
                <Modal.Body>
                    <Form>
                        <div className='row align-items-center mb-2'>
                            <div className='col-3'>
                                <label className='text-dark'>Level name: </label>
                            </div>
                            <div className='col-auto'>
                                <input type='text' className='form-control' ref={levelName} />
                            </div>
                        </div>
                        <div className='row align-items-center mb-2'>
                            <div className='col-3'>
                                <label className='text-dark'>Rating: </label>
                            </div>
                            <div className='col-auto'>
                                <input type='text' className='form-control' ref={rating} />
                            </div>
                        </div>
                        <div className='row align-items-center mb-2'>
                            <div className='col-3'>
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
                            <div className='col-3'>
                                <label className='text-dark'>Refresh rate: </label>
                            </div>
                            <div className='col-auto'>
                                <input type='text' className='form-control' ref={refreshRate} />
                            </div>
                        </div>
                        <div className='row align-items-center mb-2'>
                            <div className='col-3'>
                                <label className='text-dark'>Device: </label>
                            </div>
                            <div className='col-auto'>
                                <select className='form-select' ref={device}>
                                    <option value="0"></option>
                                    <option value="1">PC</option>
                                    <option value="2">Mobile</option>
                                </select>
                            </div>
                        </div>
                        <div className='row align-items-center'>
                            <div className='col-3'>
                                <label className='text-dark'>Proof: </label>
                            </div>
                            <div className='col-9'>
                                <input type='text' className='form-control' ref={proof} />
                            </div>
                        </div>
                    </Form>
                </Modal.Body>
                <Modal.Footer>
                    <Button variant='secondary' onClick={closeSubmit}>Close</Button>
                    <Button variant='primary' type="submit" onClick={submitForm}>Submit</Button>
                </Modal.Footer>
            </Modal>
        </>
    );
}