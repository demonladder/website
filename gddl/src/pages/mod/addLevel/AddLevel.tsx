import { useRef } from 'react';
import { PrimaryButton } from '../../../components/Button';
import { NumberInput } from '../../../components/Input';
import { toast } from 'react-toastify';
import { AddLevelToDatabase } from '../../../api/levels';
import renderToastError from '../../../utils/renderToastError';

export default function AddLevel() {
    const levelIDRef = useRef<HTMLInputElement>(null);

    function submit() {
        if (levelIDRef.current === null) {
            return toast.error('An error occurred');
        }

        toast.promise(AddLevelToDatabase(parseInt(levelIDRef.current.value)), {
            pending: 'Updating database...',
            success: 'Updated!',
            error: renderToastError,
        });
    }

    return (
        <div>
            <h3 className='text-2xl'>Add Level</h3>
            <p className='mb-3'>Here you can add levels that don't yet exist in the GDDL database or update existing levels. Click the button to sync the level, creator, difficulty and song to the GD database.</p>
            <div className='mb-2'>
                <label htmlFor='addLevelInput' className='font-bold block mb-1'>Level ID</label>
                <NumberInput ref={levelIDRef} id='addLevelInput' />
            </div>
            <PrimaryButton onClick={submit}>Add / update</PrimaryButton>
        </div>
    );
}