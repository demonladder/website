import useLocalStorage from '../hooks/useLocalStorage';
import { TextInput } from '../components/shared/input/Input';
import { PrimaryButton } from '../components/ui/buttons/PrimaryButton';
import { useEffect, useState } from 'react';
import { toast } from 'react-toastify';
import { Heading1 } from '../components/headings';
import APIClient from '../api/APIClient';
import { AxiosError } from 'axios';
import renderToastError from '../utils/renderToastError';
import { useMutation } from '@tanstack/react-query';
import FloatingLoadingSpinner from '../components/ui/FloatingLoadingSpinner';
import useNavbarNotification from '../context/navbarNotification/useNavbarNotification';

export default function BetaGuard({ children }: { children?: React.ReactNode }) {
    const [accessToken, setAccessToken] = useLocalStorage<string>('accessToken');
    const [inputValue, setInputValue] = useState(accessToken ?? '');
    const [hasAccess, setHasAccess] = useState(false);
    const shouldProtect = import.meta.env.MODE === 'staging';

    const mutation = useMutation({
        mutationFn: (key: string) => APIClient.post('/beta/enter', { key }),
        onError: (err: AxiosError) => void toast.error(renderToastError.render({ data: err })),
        onSuccess: (_, key) => {
            setAccessToken(key);
            setHasAccess(true);
            toast.success('Access granted');
        },
    });

    function handleSubmit(e: React.FormEvent) {
        e.preventDefault();
        if (inputValue === '') return toast.error('Please enter a key');

        mutation.mutate(inputValue);
    }

    const notifs = useNavbarNotification();

    useEffect(() => {
        if (shouldProtect) {
            notifs.warning('You are currently on the beta version of GDDL.');

            if (accessToken) {
                mutation.mutate(accessToken);
            }
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    if (shouldProtect && !hasAccess) {
        return (
            <div className='bg-theme-700 text-theme-text min-h-screen flex items-center justify-center'>
                <div>
                    <Heading1>GDDL Beta</Heading1>
                    <form onSubmit={handleSubmit} className='my-4'>
                        <TextInput value={inputValue} onChange={(e) => setInputValue(e.target.value)} placeholder='Access key' />
                        <PrimaryButton type='submit' disabled={mutation.isPending}>Enter</PrimaryButton>
                    </form>
                    {mutation.isPending && <FloatingLoadingSpinner />}
                </div>
            </div>
        );
    }

    return children;
}
