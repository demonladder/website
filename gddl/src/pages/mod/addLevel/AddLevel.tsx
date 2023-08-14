import { useRef } from 'react';
import { PrimaryButton } from '../../../components/Button';
import { NumberInput } from '../../../components/Input';
import { toast } from 'react-toastify';
import { AddLevelToDatabase } from '../../../api/levels';
import { AxiosError } from 'axios';

export default function AddLevel() {
    const levelIDRef = useRef<HTMLInputElement>(null);

    function submit() {
        if (levelIDRef.current === null) {
            return toast.error('An error occurred');
        }

        toast.promise(AddLevelToDatabase(parseInt(levelIDRef.current.value)), {
            pending: 'Adding...',
            success: 'Added level',
            error: {
                render({ data }: { data?: AxiosError | undefined }) {
                    if (data?.response && data.response.data && (data.response.data as any).error) {
                        return (data.response.data as any).error;
                    }
                    
                    return 'An error occurred';
                }
            }
        });
    }

    return (
        <div>
            <h3 className='text-2xl mb-3'>Add Level</h3>
            <label htmlFor='addLevelInput'>Level ID</label>
            <NumberInput ref={levelIDRef} id='addLevelInput' />
            <PrimaryButton onClick={submit}>Add</PrimaryButton>
        </div>
    );
}