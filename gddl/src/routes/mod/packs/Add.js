import React, { useState } from 'react';
import { Button, Form } from 'react-bootstrap';
import LevelSearchBox from '../../../components/LevelSearchBox';
import FetchLevels from '../../../fetches/Levels';
const { uuid } = require('uuidv4');

export default function Add({ pack, setChangeList }) {
    const [result, setResult] = useState(null);
    
    function handleSubmit() {
        setChangeList(prev => [...prev, {
            type: 'add',
            level: result || { ID: '-1', Name: 'null' },
            pack,
            ID: uuid()
        }]);    
    }

    async function handleSearch(search) {
        return FetchLevels.byName(search).then(data => data.levels).then(levels => {
            levels.forEach(l => l.msg = l.Name + ' by ' + l.Creator);
            return levels;
        });
    }

    return (
        <div className='mb-5 position-relative'>
            <Form.Group className='mb-3'>
                <Form.Label>Search</Form.Label>
                <LevelSearchBox setResult={setResult} />
            </Form.Group>
            <Button variant='primary' onClick={handleSubmit}>Add level</Button>
        </div>
    );
}