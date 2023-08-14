import { useRef } from 'react';
import { PrimaryButton } from '../../../components/Button';
import { TextInput } from '../../../components/Input';
import { toast } from 'react-toastify';
import { CreatePacks } from '../../../api/packs';
import TextArea from '../../../components/input/TextArea';

export default function CreatePack() {
    const nameRef = useRef<HTMLInputElement>(null);
    const descriptionRef = useRef<HTMLTextAreaElement>(null);

    function submit() {
        if (nameRef.current === null || descriptionRef.current === null) {
            return toast.error('An error occurred');
        }
        
        const name = nameRef.current.value;
        const description = descriptionRef.current.value;

        if (!name) {
            return toast.error('Name can\'t be empty');
        }
        if (!description) {
            return toast.error('Description can\'t be empty');
        }

        toast.promise(CreatePacks(name, description), {
            pending: 'Creating...',
            success: 'Created ' + name,
            error: 'An error occurred',
        });
    }

    return (
        <div>
            <h3 className='mb-3 text-2xl'>Create Pack</h3>
            <div className='mb-3'>
                <label>Pack name:</label>
                <TextInput className='mb-2' ref={nameRef} />
            </div>
            <div>
                <label>Description:</label>
                <TextArea ref={descriptionRef} placeholder='-' />
            </div>
            <PrimaryButton onClick={submit}>Create</PrimaryButton>
        </div>
    );
}