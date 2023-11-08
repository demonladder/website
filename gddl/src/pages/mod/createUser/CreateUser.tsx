import { useRef } from 'react';
import { PrimaryButton } from '../../../components/Button';
import { TextInput } from '../../../components/Input';
import { toast } from 'react-toastify';
import APIClient from '../../../api/axios';
import StorageManager from '../../../utils/StorageManager';

export default function CreateUser() {
    const nameRef = useRef<HTMLInputElement>(null);

    function submit() {
        if (nameRef.current === null) {
            return toast.error('An error occurred');
        }

        if (!nameRef.current.value) {
            return toast.error('Name can\'t be empty');
        }

        const csrfToken = StorageManager.getCSRF();
        toast.promise(APIClient.post('/user', { username: nameRef.current.value }, { withCredentials: true, params: { csrfToken }}), {
            pending: 'Creating user...',
            success: 'User created!',
            error: 'An error occurred',
        });
    }

    return (
        <div>
            <h3 className='text-2xl'>Create User</h3>
            <p className='mb-3'>Meant for adding bulk submission users with no existing accounts.</p>
            <TextInput ref={nameRef} placeholder='Username...' />
            <PrimaryButton onClick={submit}>Add</PrimaryButton>
        </div>
    );
}