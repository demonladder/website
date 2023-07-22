import { useState } from 'react';
import { Form, Tab, Tabs } from 'react-bootstrap';
import PackSearchBox from '../../../components/PackSearchBox';
import Add from './Add';
import ChangeItem, { PackChange } from './ChangeItem';
import Move from './Move';
import Remove from './Remove';

export default function EditPacks() {
    const [result, setResult] = useState(null);

    const [changeList, setChangeList] = useState<PackChange[]>([]);
    function removeChange(id: PackChange["ID"]) {
        setChangeList(changeList.filter((c: PackChange) => c.ID !== id));
    }

    return (
        <div id='edit-packs' className='position-relative'>
            <h3 className='text-2xl'>Edit packs</h3>
            <p className='mb-5'>Select a range of edits to perform. Once done, click the save button to push the changes. A changelog will also be generated.</p>
            <div className='mb-5'>
                <Form.Label htmlFor='editPacksSearch' className='me-3 mb-0 align-self-center'>Choose pack to edit</Form.Label>
                <PackSearchBox id='editPacksSearch' setResult={setResult} />
            </div>
            <Tabs className='mb-3'>
                <Tab eventKey='add' title='Add level'>
                    <Add pack={result || { ID: 1, Name: 'null', Levels: [] }} setChangeList={setChangeList} />
                </Tab>
                <Tab eventKey='remove' title='Remove level'>
                    <Remove pack={result || { ID: 1, Name: 'null', Levels: [] }} setChangeList={setChangeList} />
                </Tab>
                <Tab eventKey='move' title='Move level'>
                    <Move />
                </Tab>
            </Tabs>
            <div>
                {changeList.length !== 0 && <h3 className='mb-3'>Change list</h3>}
                {
                    changeList.map((c) => <ChangeItem change={c} remove={removeChange} key={c.ID} />)
                }
            </div>
        </div>
    );
}