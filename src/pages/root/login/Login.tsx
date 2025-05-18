import { Link, useNavigate } from 'react-router-dom';
import { PasswordInput, TextInput } from '../../../components/Input';
import { PrimaryButton } from '../../../components/ui/buttons/PrimaryButton';
import APIClient from '../../../api/APIClient';
import { useState } from 'react';
import { toast } from 'react-toastify';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import renderToastError from '../../../utils/renderToastError';
import FormInputLabel from '../../../components/form/FormInputLabel';
import Page from '../../../components/Page';
import Heading1 from '../../../components/headings/Heading1';
import FormGroup from '../../../components/form/FormGroup';

export default function Login() {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');

    const queryClient = useQueryClient();
    const navigate = useNavigate();

    const { mutate: submit, isLoading } = useMutation({
        mutationFn: (body: { username: string, password: string }) => toast.promise(APIClient.post<string>('/account/login', body).then(() => {
            void queryClient.invalidateQueries(['me']);
            navigate(-1);
        }), {
            pending: 'Logging in...',
            success: 'Logged in!',
            error: renderToastError,
        }),
    });

    function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
        e.preventDefault();
        submit({ username, password });
    }

    return (
        <Page>
            <div className='flex justify-center'>
                <form className='w-11/12 md:w-1/2 lg:w-2/6' onSubmit={handleSubmit}>
                    <Heading1 className='mb-4'>Login</Heading1>
                    <FormGroup>
                        <FormInputLabel htmlFor='loginUsername'>Username</FormInputLabel>
                        <TextInput value={username} onChange={(e) => setUsername(e.target.value)} id='loginUsername' name='username' autoComplete='username' />
                    </FormGroup>
                    <FormGroup>
                        <FormInputLabel htmlFor='loginPassword'>Password</FormInputLabel>
                        <PasswordInput value={password} onChange={(e) => setPassword(e.target.value)} id='loginPassword' name='password' autoComplete='current-password' autoCapitalize='off' />
                    </FormGroup>
                    <PrimaryButton type='submit' className='relative mt-4 w-full' loading={isLoading}>Log in</PrimaryButton>
                    <div className='mt-8'>
                        <p className='text-center'>
                            Don't have an account? Register <Link to='/signup' className='text-blue-400 underline'>here!</Link>
                        </p>
                        <p className='text-center mt-1'>
                            <Link to='/forgotPassword' className='hover:text-blue-400 underline'>Forgot password?</Link>
                        </p>
                    </div>
                </form>
            </div>
        </Page>
    );
}
