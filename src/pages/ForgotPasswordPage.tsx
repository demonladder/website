import { useRef, useState } from 'react';
import { PrimaryButton } from '../components/ui/buttons/PrimaryButton';
import { TextInput } from '../components/Input';
import Heading1 from '../components/headings/Heading1';
import Page from '../components/Page';
import FormGroup from '../components/form/FormGroup';
import { useMutation } from '@tanstack/react-query';
import { Id, toast } from 'react-toastify';
import renderToastError from '../utils/renderToastError';
import { AxiosError } from 'axios';
import { forgotPassword } from '../api/auth/forgotPassword';

export default function ForgotPassword() {
    const [username, setUsername] = useState('');

    const toastHandle = useRef<Id | null>(null);
    const mutation = useMutation({
        mutationFn: forgotPassword,
        onMutate: () => toastHandle.current = toast.loading('Sending...'),
        onSuccess: () => toast.update(toastHandle.current!, { type: 'success', render: 'DM sent!', autoClose: null, isLoading: false }),
        onError: (err: AxiosError) => toast.update(toastHandle.current!, { type: 'error', render: () => renderToastError.render({ data: err }), autoClose: null, isLoading: false }),
    });

    function onSubmit(e: React.FormEvent<HTMLFormElement>) {
        e.preventDefault();

        mutation.mutate(username);
    }

    return (
        <Page>
            <div className='flex justify-center'>
                <div className='w-11/12 md:w-1/2 lg:w-2/6'>
                    <Heading1 className='mb-4'>Forgot password?</Heading1>
                    <p>Enter your Discord username below and you will be sent a link to reset your password.</p>
                    <p>If you have not linked your GDDL account to Discord, join <a href='https://discord.gg/gddl'>our Discord</a> and create a thread in <b>#support</b>.</p>
                    <form onSubmit={onSubmit}>
                        <FormGroup>
                            <TextInput value={username} onChange={(e) => setUsername(e.target.value)} placeholder='Discord username' autoComplete='discord username' invalid={username.match(/^[a-zA-Z0-9._]{2,32}$/) === null} />
                        </FormGroup>
                        <PrimaryButton type='submit' disabled={mutation.isPending}>Send</PrimaryButton>
                    </form>
                </div>
            </div>
        </Page>
    );
}
