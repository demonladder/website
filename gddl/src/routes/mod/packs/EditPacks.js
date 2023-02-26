import React, { useState } from 'react';
import { Form, Tab, Tabs } from 'react-bootstrap';
import SearchBox from '../../../components/SearchBox';
import FetchPacks from '../../../fetches/Packs';
import Add from './Add';
import ChangeItem from './ChangeItem';
import Move from './Move';
import Remove from './Remove';

export default function EditPacks() {
    const [result, setResult] = useState(null);

    const [changeList, setChangeList] = useState([]);
    function removeChange(id) {
        setChangeList(changeList.filter(c => c.ID !== id));
    }

    function handleSearch(search) {
        return FetchPacks.byName(search);
    }

    return (
        <div className='position-relative'>
            <h1>Edit packs</h1>
            <p className='mb-5'>Select a range of edits to perform. Once done, click the save button to push the changes. A changelog will also be generated.</p>
            <div className='mb-5'>
                <Form.Label className='me-3 mb-0 align-self-center'>Choose pack to edit</Form.Label>
                <SearchBox dataFn={handleSearch} descriptor='Name' setFirst={setResult} />
            </div>
            <Tabs className='mb-3'>
                <Tab eventKey='add' title='Add level'>
                    <Add pack={result || { ID: 1, Name: 'null' }} setChangeList={setChangeList} />
                </Tab>
                <Tab eventKey='remove' title='Remove level'>
                    <Remove pack={result || { ID: 1, Name: 'null' }} setChangeList={setChangeList} />
                </Tab>
                <Tab eventKey='move' title='Move level'>
                    <Move />
                </Tab>
            </Tabs>
            <div>
                {changeList.length !== 0 && <h3 className='mb-3'>Change list</h3>}
                {
                    changeList.map(c => <ChangeItem change={c} remove={removeChange} key={c.ID} />)
                }
            </div>
        </div>
    );
}