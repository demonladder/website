import React, { useState } from 'react';
import { Button, Form } from 'react-bootstrap';
import LevelSearchBox from '../../../components/LevelSearchBox';
const { uuid } = require('uuidv4');

export default function Remove({ pack, setChangeList }) {
    const [result, setResult] = useState(null);
    
    function handleSubmit() {
        setChangeList(prev => [...prev, {
            type: 'remove',
            level: result || { ID: '-1', Name: 'null' },
            pack,
            ID: uuid()
        }]);    
    }

    return (
        <div className='mb-5 position-relative'>
            <Form.Group className='mb-3'>
                <Form.Label>Search</Form.Label>
                <LevelSearchBox setResult={setResult} />
            </Form.Group>
            <Button variant='primary' onClick={handleSubmit}>Remove level</Button>
        </div>
    );
}