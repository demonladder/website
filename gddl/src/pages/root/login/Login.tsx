import { useNavigate } from 'react-router-dom';
import { AxiosError } from 'axios';
import StorageManager from '../../../utils/StorageManager';
import Container from '../../../components/Container';
import { PasswordInput, TextInput } from '../../../components/Input';
import { PrimaryButton } from '../../../components/Button';
import APIClient from '../../../api/APIClient';
import { useRef, useState } from 'react';
import { toast } from 'react-toastify';
import LoadingSpinner from '../../../components/LoadingSpinner';
import { useQueryClient } from '@tanstack/react-query';

export default function Login() {
    const nameRef = useRef<HTMLInputElement>(null);
    const passwordRef = useRef<HTMLInputElement>(null);
    const [isLoading, setIsLoading] = useState(false);
    const queryClient = useQueryClient();

    const navigate = useNavigate();

    function submit() {
        if (nameRef.current === null || passwordRef.current === null) {
            return;
        }

        setIsLoading(true);
        APIClient.post('/login', {
            username: nameRef.current.value,
            password: passwordRef.current.value,
        }).then((response) => {
            if (response.status === 200) {
                StorageManager.setUser(response.data);
    
                queryClient.invalidateQueries(['search']);
                return navigate('/');
            }
        }).catch((error: AxiosError) => {
            toast.error((error.response?.data as any)?.error || 'An error occurred!');
        }).finally(() => {
            setIsLoading(false);
        });
    }

    return (
        <Container>
            <div className='flex justify-center'>
                <div className='w-11/12 md:w-1/2 lg:w-2/6'>
                    <h1 className='mb-4 text-4xl'>Login</h1>
                    <div className='mb-3'>
                        <label htmlFor='loginUsername'>Username</label>
                        <TextInput ref={nameRef} id='loginUsername' name='username' />
                    </div>
                    <div className='mb-3'>
                        <label htmlFor='loginPassword'>Password</label>
                        <PasswordInput ref={passwordRef} id='loginPassword' name='password' />
                    </div>
                    <PrimaryButton onClick={submit} className='w-full' disabled={isLoading}>Login</PrimaryButton>
                    <LoadingSpinner isLoading={isLoading} />
                </div>
            </div>
        </Container>
    );
}