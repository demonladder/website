import { useRef, useState } from 'react';
import { PrimaryButton } from '../../components/ui/buttons/PrimaryButton';
import { TextInput } from '../../components/shared/input/Input';
import { Heading1 } from '../../components/headings';
import Page from '../../components/layout/Page';
import FormGroup from '../../components/form/FormGroup';
import { useMutation } from '@tanstack/react-query';
import { Id, toast } from 'react-toastify';
import renderToastError from '../../utils/renderToastError';
import { AxiosError } from 'axios';
import { forgotPassword } from '../../api/auth/forgotPassword';
import FormInputDescription from '../../components/form/FormInputDescription';

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
                    <p>Enter your <b>Discord username</b> below and you will be sent a link to reset your password.</p>
                    <p>You must share a server with our bot and have DMs open!</p>
                    <p className='my-2'>If you have not linked your GDDL account to Discord, join <a className='underline text-blue-400' href='https://discord.gg/gddl'>our Discord</a>, create a thread in <b>#support</b> and we'll get you sorted out.</p>
                    <form onSubmit={onSubmit}>
                        <FormGroup>
                            <TextInput value={username} onChange={(e) => setUsername(e.target.value)} placeholder='Username...' autoComplete='new-password' invalid={username.match(/^[a-zA-Z0-9._]{2,32}$/) === null} />
                            <FormInputDescription>Case sensitive</FormInputDescription>
                        </FormGroup>
                        <FormGroup>
                            <PrimaryButton type='submit' disabled={mutation.isPending}>Send</PrimaryButton>
                        </FormGroup>
                    </form>
                </div>
            </div>
        </Page>
    );
}
