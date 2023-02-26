import React, { useState } from 'react';
import { Button, Form } from 'react-bootstrap';
import SearchBox from '../../../components/SearchBox';
import FetchLevels from '../../../fetches/Levels';
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

    async function handleSearch(search) {
        console.log(pack);
        return FetchLevels.byPack(search, pack.ID).then(levels => {
            levels.forEach(l => l.msg = l.Name + ' by ' + l.Creator);
            return levels;
        });
    }

    return (
        <div className='mb-5 position-relative'>
            <Form.Group className='mb-3'>
                <Form.Label>Search</Form.Label>
                <SearchBox dataFn={handleSearch} descriptor='msg' setFirst={setResult} />
            </Form.Group>
            <Button variant='primary' onClick={handleSubmit}>Remove level</Button>
        </div>
    );
}