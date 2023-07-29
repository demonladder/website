import { useState } from 'react';
import { Form } from 'react-bootstrap';
import LevelSearchBox from '../../../components/LevelSearchBox';
import { DangerButton } from '../../../components/Button';
import WarningBox from '../../../components/message/WarningBox';

export default function Remove() {
    const [result, setResult] = useState(null);
    
    function handleSubmit() {  
        console.log(result);
    }

    return (
        <div className='mb-5 position-relative'>
            <WarningBox text={'Doesn\'t work yet'} />
            <Form.Group className='mb-3'>
                <Form.Label htmlFor='removeLevelSearch'>Level:</Form.Label>
                <LevelSearchBox id='removeLevelSearch' setResult={setResult} />
            </Form.Group>
            <DangerButton onClick={handleSubmit}>Remove level</DangerButton>
        </div>
    );
}