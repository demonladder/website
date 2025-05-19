import { useMemo, useState } from 'react';
import { useLocation } from 'react-router-dom';
import { PasswordInput, TextInput } from '../components/Input';
import { PrimaryButton } from '../components/ui/buttons/PrimaryButton';
import { toast } from 'react-toastify';
import renderToastError from '../utils/renderToastError';
import FormInputDescription from '../components/form/FormInputDescription';
import FormInputLabel from '../components/form/FormInputLabel';
import { validateUsername } from '../utils/validators/validateUsername';
import Page from '../components/Page';
import Heading1 from '../components/headings/Heading1';
import FormGroup from '../components/form/FormGroup';
import { useMutation } from '@tanstack/react-query';
import SignUpFn from '../api/auth/SignUp';
import _ from 'lodash';

function getCharacterVariety(text: string) {
    let variety = 0;

    if (/[0-9]/.test(text)) variety += 10;
    if (/[a-z]/.test(text)) variety += 26;
    if (/[A-Z]/.test(text)) variety += 26;
    if (/\W|_/.test(text)) variety += 32;

    return variety;
}

function percentToColor(percent: number) {
    if (percent < 40) return 'red';
    if (percent < 80) return 'yellow';
    return '#00ff00';
}

export default function SignUp() {
    const [password, setPassword] = useState('');
    const [passwordConfirm, setPasswordConfirm] = useState('');

    const url = new URLSearchParams(useLocation().search);
    const overrideKey = url.get('key');
    const [username, setUsername] = useState(url.get('name') ?? '');

    const signupMutation = useMutation({
        mutationFn: ({ username, password, overrideKey }: { username: string, password: string, overrideKey?: string }) => SignUpFn(username, password, overrideKey),
    });

    function handleSubmit(e: React.FormEvent) {
        e.preventDefault();

        if (password !== passwordConfirm) return toast.error('Passwords must match!');

        signupMutation.mutate({ username, password, overrideKey: overrideKey ?? undefined }, {
            onSuccess: (data) => {
                window.location.href = `/profile/${data.ID}`;
            },
            onError: (err) => {
                if (err instanceof Error) {
                    toast.error(renderToastError.render({ data: err }));
                } else {
                    toast.error('An unknown error occurred. Please try again later.');
                }
            },
        });
    }

    const strength = useMemo(() => {
        const entropy = password === '' ? 0 : Math.log2(getCharacterVariety(password)) * password.length;
        const secondsToCrack = 2 ** entropy / 1e9;
        return _.clamp(secondsToCrack ** 0.1466321, 0, 100);
    }, [password]);
    const strengthColor = useMemo(() => percentToColor(strength), [strength]);

    return (
        <Page>
            <div className='flex justify-center'>
                <div className='w-11/12 md:w-1/2 lg:w-2/6'>
                    <Heading1 className='mb-4'>Sign Up</Heading1>
                    {url.get('name') === null &&
                        <div className='my-6'>
                            <p>Already have your name on the site from the sheet days? Contact the staff <a className='text-blue-500 font-bold underline' href='https://discord.gg/gddl' target='_blank' rel='noopener noreferrer'>in our discord</a> to get a password reset link.</p>
                        </div>
                    }
                    <form onSubmit={handleSubmit}>
                        <FormGroup>
                            <FormInputLabel htmlFor='username'>Username</FormInputLabel>
                            <TextInput id='username' value={username} onChange={(e) => setUsername(e.target.value.trimStart())} invalid={!validateUsername(username)} pattern='^[a-zA-Z0-9._]{2,32}$' disabled={url.get('name') !== null} name='username' autoComplete='off' required />
                            <p className='text-gray-400 text-sm'>Name must be between 2 and 32 characters. It can only contain the following characters: <code>{'a-Z 0-9 . _'}</code></p>
                        </FormGroup>
                        <FormGroup>
                            <FormInputLabel htmlFor='password'>Password</FormInputLabel>
                            <PasswordInput value={password} onChange={(e) => setPassword(e.target.value.trim())} id='password' name='password' autoComplete='new-password' autoCapitalize='off' minLength={7} invalid={password.length < 7} required />
                            <div className='h-1 rounded-b' style={{ backgroundImage: `linear-gradient(to left, ${strengthColor}, ${strengthColor})`, backgroundSize: `${strength}%`, backgroundRepeat: 'no-repeat' }} />
                            <FormInputDescription>Passwords must be at least 7 characters long</FormInputDescription>
                        </FormGroup>
                        <FormGroup>
                            <FormInputLabel htmlFor='confirmPassword'>Confirm password</FormInputLabel>
                            <PasswordInput id='confirmPassword' value={passwordConfirm} onChange={(e) => setPasswordConfirm(e.target.value.trimStart())} autoComplete='new-password' autoCapitalize='off' required />
                        </FormGroup>
                        <PrimaryButton type='submit' className='mt-4 w-full'>Sign Up</PrimaryButton>
                    </form>
                </div>
            </div>
        </Page>
    );
}
