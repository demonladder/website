import { useRef, useState } from 'react';
import APIClient from '../../../../api/APIClient';
import Heading1 from '../../../../components/headings/Heading1';
import Heading3 from '../../../../components/headings/Heading3';
import { PrimaryButton } from '../../../../components/ui/buttons/PrimaryButton';
import { useMutation } from '@tanstack/react-query';
import FormInputDescription from '../../../../components/form/FormInputDescription';
import { DangerButton } from '../../../../components/ui/buttons/DangerButton';
import { AxiosError } from 'axios';
import renderToastError from '../../../../utils/renderToastError';
import { Id, toast } from 'react-toastify';

async function generateAPIKey(): Promise<string> {
    const res = await APIClient.post<string>('/apiKey');
    return res.data;
}

async function resetAPIKey(): Promise<void> {
    await APIClient.delete('/apiKey/');
}

export default function Developer() {
    const [key, setKey] = useState('');

    const generateHandle = useRef<Id | null>();
    const generateMutation = useMutation(generateAPIKey, {
        onMutate: () => generateHandle.current = toast.loading('Generating key...'),
        onSuccess: (data) => {
            setKey(data);
            toast.update(generateHandle.current!, { render: 'API key generated successfully', autoClose: null, type: 'success', isLoading: false });
        },
        onError: (err: AxiosError) => toast.update(generateHandle.current!, { render: renderToastError.render({ data: err }), autoClose: null, type: 'error', isLoading: false }),
    });

    const resetHandle = useRef<Id | null>();
    const resetMutation = useMutation(resetAPIKey, {
        onMutate: () => resetHandle.current = toast.loading('Resetting API key...'),
        onSuccess: () => {
            setKey('');
            toast.update(resetHandle.current!, { render: 'API key reset successfully', autoClose: null, type: 'success', isLoading: false });
        },
        onError: (err: AxiosError) => toast.update(resetHandle.current!, { render: renderToastError.render({ data: err }), autoClose: null, type: 'error', isLoading: false }),
    });

    return (
        <div>
            <Heading1 className='mb-4'>Developer settings</Heading1>
            <div>
                <Heading3>API key</Heading3>
                <p>You can only have 1 API key at a time. Do not give out this key to anyone as it gives full control over your account!</p>
                <p>To generate a new API key, click the button below. This will invalidate your current API key if you have one.</p>
                <div className='flex gap-2 mt-2'>
                    <PrimaryButton onClick={() => generateMutation.mutate()} loading={generateMutation.isLoading}>Generate</PrimaryButton>
                    <DangerButton onClick={() => resetMutation.mutate()} loading={resetMutation.isLoading}>Reset key</DangerButton>
                </div>
                {key &&
                    <div className='mt-4'>
                        <p>Your new API key:</p>
                        <p className='bg-theme-600 px-1'><code>{key}</code></p>
                        <FormInputDescription>Copy this key now, as it will dissappear once you leave this page!</FormInputDescription>
                    </div>
                }
            </div>
        </div>
    );
}
