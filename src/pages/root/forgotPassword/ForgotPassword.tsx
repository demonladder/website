import { useState } from 'react';
import { PrimaryButton } from '../../../components/ui/buttons/PrimaryButton';
import Container from '../../../components/Container';
import { TextInput } from '../../../components/Input';
import APIClient from '../../../api/APIClient';
import { toast } from 'react-toastify';
import { AxiosError } from 'axios';

export default function ForgotPassword() {
    const [username, setUsername] = useState('');
    const [nameChanged, setNameChanged] = useState(false);

    function onNameChange(name: string) {
        setUsername(name);
        setNameChanged(true);
    }

    async function onSubmit() {
        setNameChanged(false);

        try {
            await APIClient.post('/forgotPassword', { username });
            toast.success('Check your DMs');
        } catch (err) {
            toast.error(((err as AxiosError).response?.data as any)?.error ?? 'An error occurred');
        }
        // toast.success(res.data.message);
    }

    return (
        <Container>
            <div className='flex justify-center'>
                <div className='w-11/12 md:w-1/2 lg:w-2/6'>
                    <h1 className='text-4xl'>Forgot Password</h1>
                    <p>Enter your Discord username below and we will send you a link to reset your password.</p>
                    <p>If you have not linked your GDDL account to Discord, join <a href="https://discord.gg/gddl">our Discord</a> and create a support post.</p>
                    <div className='mt-2'>
                        <TextInput value={username} onChange={(e) => onNameChange(e.target.value)} placeholder='Discord username' invalid={username.match(/^[a-zA-Z0-9\._]{2,32}$/) === null} />
                    </div>
                    <PrimaryButton onClick={onSubmit} disabled={!nameChanged}>Send</PrimaryButton>
                </div>
            </div>
        </Container>
    );
}