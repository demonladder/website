import React, { useState } from 'react';
import { Form } from 'react-bootstrap';
import LevelSearchBox from '../../../components/LevelSearchBox';
import { Pack } from '../../../api/packs';
const { uuid } = require('uuidv4');

type Props = {
    pack: Pack,
    setChangeList: (e: any) => void,
}

export default function Add({ pack, setChangeList }: Props) {
    const [result, setResult] = useState(null);
    
    function handleSubmit() {
        setChangeList((prev: any) => [
            ...prev,
            {
                type: 'add',
                level: result || { ID: '-1', Name: 'null' },
                pack,
                ID: uuid()
            }
        ]);    
    }

    return (
        <div className='mb-5 position-relative'>
            <Form.Group className='mb-3'>
                <Form.Label htmlFor='addLevelSearch'>Level:</Form.Label>
                <LevelSearchBox id='addLevelSearch' setResult={setResult} />
            </Form.Group>
            <button className='primary' onClick={handleSubmit}>Add level</button>
        </div>
    );
}