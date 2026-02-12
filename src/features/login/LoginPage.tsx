import { Link, useNavigate } from 'react-router';
import { PasswordInput, TextInput } from '../../components/shared/input/Input';
import { PrimaryButton } from '../../components/ui/buttons/PrimaryButton';
import { useId, useState } from 'react';
import { toast } from 'react-toastify';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import renderToastError, { type GDDLError } from '../../utils/renderToastError';
import FormInputLabel from '../../components/form/FormInputLabel';
import Page from '../../components/layout/Page';
import { Heading1 } from '../../components/headings';
import FormGroup from '../../components/form/FormGroup';
import { accountLogin } from './api/accountLogin';
import useTurnstile from '../../hooks/useTurnstile';
import type { AxiosError } from 'axios';
import DigitCodeInput from '../../components/input/DigitCodeInput';

export default function Login() {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [isTotpRequired, setIsTotpRequired] = useState(false);
    const [totpCode, setTotpCode] = useState<string>();

    const queryClient = useQueryClient();
    const navigate = useNavigate();

    const turnstileContainerID = useId();
    const { token: turnstileToken, reset: resetCaptcha } = useTurnstile(turnstileContainerID);

    const { mutate: submit, isPending } = useMutation({
        mutationFn: ({ username, password, challenge, totpCode }: { username: string, password: string, challenge: string, totpCode?: string }) => toast.promise(accountLogin(username, password, challenge, totpCode), {
            pending: 'Logging in...',
            success: 'Logged in!',
            error: renderToastError,
        }),
        onSuccess: () => {
            void queryClient.invalidateQueries({ queryKey: ['me'] });
            void navigate(-1);
        },
        onError(error: AxiosError<GDDLError>) {
            resetCaptcha();
            if (error.response?.status === 400 && typeof error.response.data.message === 'string' && /TOTP.*required/.test(error.response.data.message)) {
                setIsTotpRequired(true);
                return;
            }
        },
    });

    function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
        e.preventDefault();
        if (!turnstileToken) return toast.error('Please complete the CAPTCHA challenge.');
        submit({ username, password, challenge: turnstileToken, totpCode });
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
                    {isTotpRequired &&
                        <div className='my-4'>
                            <p className='mb-1'>Please enter the 6-digit code from your authenticator app to continue:</p>
                            <DigitCodeInput onChange={setTotpCode} />
                        </div>
                    }
                    <div id={turnstileContainerID} className='mt-4' />
                    <PrimaryButton type='submit' className='relative mt-4 w-full' loading={isPending}>Log in</PrimaryButton>
                    <div className='mt-8'>
                        <p className='text-center'>
                            Don't have an account? Register <Link to='/signup' className='text-blue-400 underline'>here!</Link>
                        </p>
                        <p className='text-center mt-1'>
                            <Link to='/forgotPassword' className='text-blue-400 underline'>Forgot password?</Link>
                        </p>
                    </div>
                </form>
            </div>
        </Page>
    );
}
