import { useRef, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import StorageManager from '../../../utils/storageManager';
import instance from '../../../api/axios';
import Container from '../../../components/Container';
import { PasswordInput, TextInput } from '../../../components/Input';
import { PrimaryButton } from '../../../components/Button';
import { toast } from 'react-toastify';

export default function SignUp() {
    const navigate = useNavigate();

    const usernameRef = useRef<HTMLInputElement>(null);
    const passwordRef = useRef<HTMLInputElement>(null);
    const password2Ref = useRef<HTMLInputElement>(null);
    
    const url = new URLSearchParams(useLocation().search);
    const overrideKey = url.get('key') || '';
    const [username, setUsername] = useState(url.get('name') || '');

    function handleSubmit(e: React.MouseEvent<HTMLButtonElement, MouseEvent>) {
        e.preventDefault();

        const username = usernameRef.current?.value;
        const password = passwordRef.current?.value;
        const password2 = password2Ref.current?.value;

        if (!username) {
            return toast.error('Username cannot be empty!');
        }

        if (!password || password.length < 7) {
            return toast.error('Password must be longer than 6 characters!');
        }

        if (password !== password2) {
            return toast.error('Passwords must match!');
        }

        toast.promise(instance.post('/login/signup', { username, password, overrideKey }, { withCredentials: true }).then((response) => {
            if (response.status === 200) {
                StorageManager.setCSRF(response.data.csrfToken);
                StorageManager.setUser(response.data.jwt);
            }

            return response;
        }), {
            pending: 'Signing you up...',
            success: {
                render({ data: res }) {
                    if (res !== undefined) {
                        StorageManager.setCSRF(res.data.csrfToken);
                        StorageManager.setUser(res.data.jwt);
                    }
                    
                    navigate('/');
                    return 'Signed in!';
                }
            },
            error: 'An error occurred',
        });
    }

    return (
        <Container className='bg-gray-800'>
            <div className='flex justify-center'>
                <div className='w-11/12 md:w-1/2 lg:w-2/6'>
                    <h1 className='text-4xl'>Sign Up</h1>
                    <div className='my-6'>
                        <p>Already have your name on the sheet? Contact the staff <a className='text-blue-500 font-bold' href='https://discord.gg/gddl' target='_blank' rel='noopener noreferrer'>in our discord</a> to get an alternative sign up link.</p>
                    </div>
                    <form method='post' action='/signup'>
                        <div className='mb-3'>
                            <label htmlFor='username'>Username</label>
                            <TextInput ref={usernameRef} id='username' value={username} onChange={(e) => setUsername(e.target.value)} name='username' />
                        </div>
                        <div className='mb-3'>
                            <label htmlFor='password'>Password</label>
                            <PasswordInput ref={passwordRef} id='password' name='password' />
                        </div>
                        <div className='mb-3'>
                            <label htmlFor='confirmPassword'>Confirm password</label>
                            <PasswordInput ref={password2Ref} id='confirmPassword' name='password2' />
                        </div>
                        <PrimaryButton type='submit' onClick={handleSubmit} className='w-full'>Sign Up</PrimaryButton>
                    </form>
                </div>
            </div>
        </Container>
    );
}