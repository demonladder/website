import React, { useState } from 'react';
import { Tab, Tabs } from 'react-bootstrap';
import LevelSearchBox from '../../components/LevelSearchBox';
import Modal, { Body, Footer } from '../../components/Modal';
import UploadProgress from './UploadProgress';

export default function Utils() {
    const setResult = (r) => {
        console.log(r);
    }

    const [show, setShow] = useState(false);

    function test() {
        console.log('Test button clicked');
    }

    return (
        <div className='container'>
            <h1 className='mb-4'>Utils</h1>
            <Tabs defaultActiveKey='uploadProgress' className='mb-3'>
                <Tab eventKey='uploadProgress' title='Upload progress'>
                    <UploadProgress />
                </Tab>
                <Tab eventKey='modal' title='Modal'>
                    <button onClick={() => setShow(true)}>Show modal</button>
                    <Modal title='Submit rating' show={show} onHide={() => setShow(false)}>
                        <Body>
                            <label>Level name: </label>
                            <LevelSearchBox setResult={setResult} />
                            <label>Rating</label>
                            <input type='number' min='1' max='35' className='num-sm' />
                        </Body>
                        <Footer>
                            <div className='d-flex justify-content-end gap-2'>
                                <button className='underline' onClick={() => setShow(false)}>Close</button>
                                <button type='submit' className='underline'>Submit</button>
                            </div>
                        </Footer>
                    </Modal>
                </Tab>
                <Tab eventKey='tests' title='Tests'>
                    <button onClick={test}>Click Me!</button>
                </Tab>
            </Tabs>
        </div>
    )
}