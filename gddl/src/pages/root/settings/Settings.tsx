import { useState } from 'react';
import { PrimaryButton } from '../../../components/Button';
import Container from '../../../components/Container';
import { CheckBox } from '../../../components/Input';
import StorageManager from '../../../utils/storageManager';
import oreo from '../../../assets/oreo.jpg';

export default function Settings() {
    const [rounded, setRounded] = useState<boolean>(StorageManager.getIsRounded());
    
    function onSave() {
        StorageManager.setRounded(rounded);
        location.reload();
    }

    return (
        <Container>
            <h1 className='text-4xl'>Settings</h1>
            <p className='mb-4'>There's not much here yet, but have a cookie <span className='inline-block'><img width='32px' src={oreo} /></span></p>
            <div className='text-lg mb-4'>
                <label className='flex items-center gap-2'>
                    <CheckBox checked={rounded} onClick={() => setRounded((prev) => !prev)} />
                    Rounded corners
                </label>
            </div>
            <div>
                <PrimaryButton onClick={onSave}>Save</PrimaryButton>
            </div>
        </Container>
    );
}