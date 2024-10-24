import { Link, useNavigate } from 'react-router-dom';
import Container from '../../../components/Container';
import { PasswordInput, TextInput } from '../../../components/Input';
import { PrimaryButton } from '../../../components/Button';
import APIClient from '../../../api/APIClient';
import { useRef } from 'react';
import { toast } from 'react-toastify';
import { useMutation } from '@tanstack/react-query';
import renderToastError from '../../../utils/renderToastError';
import useUser from '../../../hooks/useUser';
import FormInputLabel from '../../../components/form/FormInputLabel';

export default function Login() {
    const nameRef = useRef<HTMLInputElement>(null);
    const passwordRef = useRef<HTMLInputElement>(null);
    const session = useUser();

    const navigate = useNavigate();

    const { mutate: submit, isLoading } = useMutation({
        mutationFn: () => toast.promise(APIClient.post<string>('/login', {
            username: nameRef.current?.value,
            password: passwordRef.current?.value,
        }).then(() => {
            session.login();
            navigate('/');
        }), {
            pending: 'Logging in...',
            success: 'Logged in!',
            error: renderToastError,
        }),
    });

    function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
        e.preventDefault();
        submit();
    }

    return (
        <Container>
            <div className='flex justify-center'>
                <form className='w-11/12 md:w-1/2 lg:w-2/6' onSubmit={(e) => handleSubmit(e)}>
                    <h1 className='mb-4 text-4xl'>Login</h1>
                    <div className='mb-3'>
                        <FormInputLabel htmlFor='loginUsername'>Username</FormInputLabel>
                        <TextInput ref={nameRef} id='loginUsername' name='username' />
                    </div>
                    <div className='mb-3'>
                        <FormInputLabel htmlFor='loginPassword'>Password</FormInputLabel>
                        <PasswordInput ref={passwordRef} id='loginPassword' name='password' />
                    </div>
                    <PrimaryButton type='submit' onClick={() => submit()} className='relative w-full' loading={isLoading}>Log in</PrimaryButton>
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
        </Container>
    );
}