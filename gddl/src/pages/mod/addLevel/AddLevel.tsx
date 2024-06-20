import { useState } from 'react';
import { PrimaryButton } from '../../../components/Button';
import { TextInput } from '../../../components/Input';
import { toast } from 'react-toastify';
import AddLevelToDatabase from '../../../api/level/AddLevelToDatabase';
import renderToastError from '../../../utils/renderToastError';

export default function AddLevel() {
    const [input, setInput] = useState('');

    function submit() {
        if (!parseInt(input)) {
            return toast.error('Paste a level ID');
        }

        toast.promise(AddLevelToDatabase(parseInt(input)), {
            pending: 'Updating database...',
            success: 'Updated!',
            error: renderToastError,
        });
    }

    // input type="number" is stupid when it comes to onChange so I used a text input with custom validation:
    function handleChange(e: React.ChangeEvent<HTMLInputElement>) {
        const newVal = e.target.value.trim();
        if (newVal === '') {
            setInput('');
            return;
        }
        if (isNaN(parseInt(newVal))) return;

        setInput(newVal);
    }

    return (
        <div>
            <h3 className='text-2xl'>Sync Level</h3>
            <p className='mb-3'>Here you can add levels that don't yet exist in the GDDL database or update existing levels. Click the button to sync the level, creator, difficulty and song to the GD database.</p>
            <div className='mb-2'>
                <label htmlFor='addLevelInput' className='font-bold block mb-1'>Level ID</label>
                <TextInput value={input} onChange={handleChange} id='addLevelInput' />
            </div>
            <PrimaryButton onClick={submit}>Sync</PrimaryButton>
        </div>
    );
}