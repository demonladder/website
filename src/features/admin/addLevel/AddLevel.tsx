import { useState } from 'react';
import { PrimaryButton } from '../../../components/ui/buttons/PrimaryButton';
import { TextInput } from '../../../components/Input';
import { toast } from 'react-toastify';
import { addLevelFromGD } from './api/addLevelFromGD';
import renderToastError from '../../../utils/renderToastError';
import { useQueryClient } from '@tanstack/react-query';

export default function AddLevel() {
    const [input, setInput] = useState('');
    const queryClient = useQueryClient();

    function submit() {
        const parsedInput = parseInt(input.trim());
        if (isNaN(parsedInput) || parsedInput <= 0) {
            return toast.error('Paste a proper level ID');
        }

        void toast.promise(addLevelFromGD(parsedInput).then(() => queryClient.invalidateQueries(['level', parsedInput])), {
            pending: 'Updating database...',
            success: 'Updated!',
            error: renderToastError,
        });
    }

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
