import { useEffect, useRef, useState } from 'react';
import QRCode from 'qrcode';
import Heading1 from '../../components/headings/Heading1';
import { useLoaderData, useNavigate } from 'react-router';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import APIClient from '../../api/APIClient';
import { toast } from 'react-toastify';
import type { AxiosError } from 'axios';
import renderToastError from '../../utils/renderToastError';

export default function TOTPRegisterPage() {
    const qrCodeCanvasRef = useRef<HTMLCanvasElement>(null);
    const otpUrl = useLoaderData<string>();
    const [code, setCode] = useState('');
    const queryClient = useQueryClient();

    useEffect(() => {
        if (!qrCodeCanvasRef.current) return;
        QRCode.toCanvas(qrCodeCanvasRef.current, otpUrl, {
            errorCorrectionLevel: 'low',

        }, function (error) {
            if (error) console.error(error);
            else console.log('success!');
        });
    }, [otpUrl]);

    const navigate = useNavigate();
    function goBack() {
        void navigate(-1);
    }

    const submitMutation = useMutation({
        mutationFn: async (code: string) => APIClient.post('/auth/totp/verify-secret', { code }),
        onError: (error: AxiosError) => toast.error(renderToastError.render({ data: error })),
    });

    function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
        e.preventDefault();
        submitMutation.mutate(code, {
            onSuccess: () => {
                toast.success('2FA enabled successfully!');
                queryClient.setQueryData(['has2FA'], true);
                void goBack();
            },
        });
    }

    return (
        <div className='grow flex flex-col justify-center items-center'>
            <div className='bg-theme-800 p-4 rounded-xl shadow-md w-xl text-center'>
                <Heading1>Add 2FA</Heading1>
                <p>Two-factor authentication adds an extra layer of security to your account.</p>
                <p className='mt-4'><b>Step 1</b>: Download an authenticator app (e.g., <a className='text-blue-400 underline!' href='https://play.google.com/store/apps/details?id=com.google.android.apps.authenticator2'>Google Authenticator</a>).</p>
                <p className='mt-4'><b>Step 2</b>: Scan the QR code below with your authenticator app.</p>
                <canvas ref={qrCodeCanvasRef} className='mx-auto my-4' />
                <p>or copy the code below if you're on desktop:</p>
                <code>{new URL(otpUrl).searchParams.get('secret')}</code>
                <p className='mt-4'><b>Step 3</b>: Verify by entering the code from your authenticator app.</p>
                <form onSubmit={handleSubmit}>
                    <input type='text' value={code} onChange={(e) => setCode(e.target.value)} placeholder='XXXXXX' maxLength={6} className='w-full border text-4xl text-center spacing rounded no-spinner my-4' />
                    <button type='submit' className='bg-blue-600 hover:bg-blue-700 active:bg-blue-800 transition-colors text-white rounded px-4 py-2 mt-2 w-full'>Save</button>
                    <button onClick={goBack} type='button' className='mt-2 w-full block border border-theme-400 py-2 rounded'>Cancel</button>
                </form>
            </div>
        </div>
    );
}
