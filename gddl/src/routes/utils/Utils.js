import React from 'react';
import { Tab, Tabs } from 'react-bootstrap';
import UploadProgress from './UploadProgress';

export default function Utils() {
    return (
        <div className='container'>
            <h1 className='mb-4'>Utils</h1>
            <Tabs defaultActiveKey='uploadProgress' className='mb-3'>
                <Tab eventKey='uploadProgress' title='Upload progress'>
                    <UploadProgress />
                </Tab>
                <Tab eventKey='otherUtil' title='Other utils'>
                    <div>
                        <p>Other util</p>
                    </div>
                </Tab>
            </Tabs>
        </div>
    )
}