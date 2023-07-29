import { useState } from 'react';
import LevelSearchBox from '../../../components/LevelSearchBox';
import { PrimaryButton } from '../../../components/Button';
import PackSearchBox from '../../../components/PackSearchBox';
import { toast } from 'react-toastify';
import WarningBox from '../../../components/message/WarningBox';

export default function Add() {
    const [packResult, setPackResult] = useState(null);
    const [levelResult, setLevelResult] = useState(null);
    
    function handleSubmit() {
        if (packResult === null) {
            return toast.error('Select a pack!');
        }
        
        if (levelResult === null) {
            return toast.error('Select a level!');
        }
    }

    return (
        <div>
            <WarningBox text={'Doesn\'t work yet'} />
            <div className='mb-4'>
                <label htmlFor='editPacksSearch' className='me-3 mb-0 align-self-center'>Choose pack to edit</label>
                <PackSearchBox id='editPacksSearch' setResult={setPackResult} />
            </div>
            <div>
                <label htmlFor='addLevelSearch'>Level:</label>
                <LevelSearchBox id='addLevelSearch' setResult={setLevelResult} />
            </div>
            <PrimaryButton onClick={handleSubmit}>Add level</PrimaryButton>
        </div>
    );
}