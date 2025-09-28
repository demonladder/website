import { useRef, useState } from 'react';
import Heading1 from '../../components/headings/Heading1';
import { toast } from 'react-toastify';
import { useMutation } from '@tanstack/react-query';
import APIClient from '../../api/APIClient';
import { useNavigate } from 'react-router';
import type { AxiosError } from 'axios';
import renderToastError from '../../utils/renderToastError';

export default function TOTPPage() {
    const [code, setCode] = useState(['', '', '', '', '', '']);
    const digit1Ref = useRef<HTMLInputElement>(null);
    const digit2Ref = useRef<HTMLInputElement>(null);
    const digit3Ref = useRef<HTMLInputElement>(null);
    const digit4Ref = useRef<HTMLInputElement>(null);
    const digit5Ref = useRef<HTMLInputElement>(null);
    const digit6Ref = useRef<HTMLInputElement>(null);

    const focusInteropRef = useRef(false);
    function handleChange(index: number, e: React.ChangeEvent<HTMLInputElement>) {
        const { value } = e.target;
        if (isNaN(Number(value))) return;

        // Handles pasting the entire code
        if (value.length === 6) {
            setCode(value.split('').slice(0, 6));
            digit6Ref.current?.focus();
            return;
        }

        if (value.length > 1) return;

        const newCode = [...code];
        newCode[index] = value;
        setCode(newCode);
        focusInteropRef.current = true;
        if (value && index < 5) {
            const nextRef = [digit1Ref, digit2Ref, digit3Ref, digit4Ref, digit5Ref, digit6Ref][index + 1];
            nextRef.current?.focus();
        } else if (!value && index > 0) {
            const prevRef = [digit1Ref, digit2Ref, digit3Ref, digit4Ref, digit5Ref, digit6Ref][index - 1];
            prevRef.current?.focus();
        }
    }

    function handleFocus(index: number) {
        if (focusInteropRef.current) {
            focusInteropRef.current = false;
            return;
        }
        const inputtedDigits = code.slice(0, index).filter(d => d !== '').length;
        if (inputtedDigits < index) {
            const firstEmptyIndex = code.findIndex(d => d === '');
            const firstEmptyRef = [digit1Ref, digit2Ref, digit3Ref, digit4Ref, digit5Ref, digit6Ref][firstEmptyIndex];
            firstEmptyRef.current?.focus();
        }
    }

    function onKeyDown(e: React.KeyboardEvent) {
        if (e.key === 'Backspace') {
            const firstEmptyIndex = code.findIndex((d) => d === '');
            if (firstEmptyIndex === -1 || firstEmptyIndex === 0) return;

            e.preventDefault();
            const newCode = [...code];
            newCode[firstEmptyIndex - 1] = '';
            setCode(newCode);
            const firstEmptyRef = [digit1Ref, digit2Ref, digit3Ref, digit4Ref, digit5Ref, digit6Ref][firstEmptyIndex - 1];
            firstEmptyRef.current?.focus();
        }
    }

    const navigate = useNavigate();
    const submitMutation = useMutation({
        mutationFn: async (token: string) => await APIClient.post('/auth/totp/authenticate', { code: token }),
        onSuccess: () => navigate(-1),
        onError: (error: AxiosError) => toast.error(renderToastError.render({ data: error })),
    });

    function handleSubmit(e: React.FormEvent) {
        e.preventDefault();

        if (submitMutation.isPending) return;

        const token = code.join('');
        if (token.length < 6) {
            toast.error('Please enter the complete 6-digit code.');
            return;
        }

        submitMutation.mutate(token);
    }

    return (
        <div className='grow flex flex-col justify-center items-center'>
            <form onSubmit={handleSubmit} className='bg-theme-800 p-4 rounded shadow-md w-lg text-center'>
                <Heading1>Two-Factor Authentication</Heading1>
                <p className='mb-2'>Enter the code from your authenticator app below to continue</p>
                <div className='flex gap-2'>
                    <input ref={digit1Ref} type='number' required maxLength={1} className='w-full border text-6xl text-center spacing rounded no-spinner' value={code[0]} onChange={(e) => handleChange(0, e)} onFocus={() => handleFocus(0)} onKeyDown={onKeyDown} />
                    <input ref={digit2Ref} type='number' required maxLength={1} className='w-full border text-6xl text-center spacing rounded no-spinner' value={code[1]} onChange={(e) => handleChange(1, e)} onFocus={() => handleFocus(1)} onKeyDown={onKeyDown} />
                    <input ref={digit3Ref} type='number' required maxLength={1} className='w-full border text-6xl text-center spacing rounded no-spinner' value={code[2]} onChange={(e) => handleChange(2, e)} onFocus={() => handleFocus(2)} onKeyDown={onKeyDown} />
                    <input ref={digit4Ref} type='number' required maxLength={1} className='w-full border text-6xl text-center spacing rounded no-spinner' value={code[3]} onChange={(e) => handleChange(3, e)} onFocus={() => handleFocus(3)} onKeyDown={onKeyDown} />
                    <input ref={digit5Ref} type='number' required maxLength={1} className='w-full border text-6xl text-center spacing rounded no-spinner' value={code[4]} onChange={(e) => handleChange(4, e)} onFocus={() => handleFocus(4)} onKeyDown={onKeyDown} />
                    <input ref={digit6Ref} type='number' required maxLength={1} className='w-full border text-6xl text-center spacing rounded no-spinner' value={code[5]} onChange={(e) => handleChange(5, e)} onFocus={() => handleFocus(5)} onKeyDown={onKeyDown} />
                </div>
                <button type='submit' className='bg-blue-600 hover:bg-blue-700 active:bg-blue-800 transition-colors text-white rounded px-4 py-2 mt-4 w-full'>Submit</button>
            </form>
        </div>
    );
}
