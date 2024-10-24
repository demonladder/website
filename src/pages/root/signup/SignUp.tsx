import { useRef, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import APIClient from '../../../api/APIClient';
import Container from '../../../components/Container';
import { PasswordInput, TextInput } from '../../../components/Input';
import { PrimaryButton } from '../../../components/Button';
import { toast } from 'react-toastify';
import renderToastError from '../../../utils/renderToastError';
import FormInputDescription from '../../../components/form/FormInputDescription';
import FormInputLabel from '../../../components/form/FormInputLabel';
import { validateUsername } from '../../../utils/validators/validateUsername';

export default function SignUp() {
    const navigate = useNavigate();

    const [password, setPassword] = useState('');
    const password2Ref = useRef<HTMLInputElement>(null);

    const url = new URLSearchParams(useLocation().search);
    const overrideKey = url.get('key');
    const [username, setUsername] = useState(url.get('name') || '');

    function handleSubmit(e: React.MouseEvent<HTMLButtonElement, MouseEvent>) {
        e.preventDefault();

        if (!password2Ref.current) return;

        const password2 = password2Ref.current.value;

        if (!username) return toast.error('Username cannot be empty!');
        if (username.length < 3 || username.length > 30) return toast.error('Name must be between 2 and 32 characters long!');
        if (!validateUsername(username)) return toast.error('Name contains banned characters!');

        if (!password || password.length < 7) {
            return toast.error('Password must be longer than 6 characters!');
        }

        if (password !== password2) {
            return toast.error('Passwords must match!');
        }

        void toast.promise(APIClient.post<string>('/login/signup', {
            username,
            password,
            overrideKey,
        }).then((response) => {
            if (response.status === 200) {
                navigate(-1);
            }

            return response;
        }), {
            pending: 'Signing you up...',
            success: 'Signed in!',
            error: renderToastError,
        });
    }

    return (
        <Container className='bg-gray-800'>
            <div className='flex justify-center'>
                <div className='w-11/12 md:w-1/2 lg:w-2/6'>
                    <h1 className='text-4xl mb-4'>Sign Up</h1>
                    {url.get('name') === null &&
                        <div className='my-6'>
                            <p>Already have your name on the site? Contact the staff <a className='text-blue-500 font-bold underline' href='https://discord.gg/gddl' target='_blank' rel='noopener noreferrer'>in our discord</a> to get an alternative sign up link.</p>
                        </div>
                    }
                    <form method='post' action='/signup'>
                        <div className='mb-3'>
                            <FormInputLabel htmlFor='username'>Username</FormInputLabel>
                            <TextInput id='username' value={username} onChange={(e) => overrideKey === null && setUsername(e.target.value)} invalid={!validateUsername(username)} name='username' />
                            <p className='text-gray-400 text-sm'>Name must be between 2 and 32 characters. It can only contain the following characters: <code>{'a-Z 0-9 . _'}</code></p>
                        </div>
                        <div className='mb-3'>
                            <FormInputLabel htmlFor='password'>Password</FormInputLabel>
                            <PasswordInput value={password} onChange={(e) => setPassword(e.target.value.trim())} id='password' name='password' autoComplete='new-password' invalid={password.length < 7} required />
                            <FormInputDescription>Passwords must be at least 7 characters long</FormInputDescription>
                        </div>
                        <div className='mb-3'>
                            <FormInputLabel htmlFor='confirmPassword'>Confirm password</FormInputLabel>
                            <PasswordInput ref={password2Ref} id='confirmPassword' name='password2' autoComplete='new-password' required />
                        </div>
                        <PrimaryButton type='submit' onClick={handleSubmit} className='w-full'>Sign Up</PrimaryButton>
                    </form>
                </div>
            </div>
        </Container>
    );
}