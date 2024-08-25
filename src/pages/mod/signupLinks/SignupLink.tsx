import { useState } from 'react';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import GetSignupTokens, { TokenPair } from '../../../api/signupToken/GetSignupTokens';
import SignupToken from '../../../api/signupToken/SignupToken';
import LoadingSpinner from '../../../components/LoadingSpinner';
import UserSearchBox from '../../../components/UserSearchBox';
import { TinyUser } from '../../../api/types/TinyUser';
import { PrimaryButton } from '../../../components/Button';
import { toast } from 'react-toastify';
import renderToastError from '../../../utils/renderToastError';
import FormInputLabel from '../../../components/form/FormInputLabel';

function Token({ token }: { token: TokenPair }) {
    const link = 'https://gdladder.com/signup?key=' + token.Token + '&name=' + token.Name;

    function linkClick(e: React.MouseEvent<HTMLParagraphElement>) {
        void navigator.clipboard.writeText(link);

        (e.target as Element).classList.remove('bg-fade');
        setTimeout(() => {
            (e.target as Element).classList.add('bg-fade');
        }, 10);
    }

    return (
        <div>
            <p><b>{token.Name}:</b></p>
            <p className='break-words cursor-pointer inline underline' onClick={linkClick}>{link}</p>
        </div>
    );
}

export default function SignupLink() {
    const [result, setResult] = useState<TinyUser>();

    const { data: tokens } = useQuery({
        queryKey: ['signupTokens'],
        queryFn: GetSignupTokens,
        staleTime: 10000, // 10 seconds
    });

    const queryClient = useQueryClient();
    const genToken = useMutation({
        mutationFn: async (context: number) => toast.promise(SignupToken(context).then(() => queryClient.invalidateQueries(['signupTokens'])), {
            pending: 'Generating...',
            success: 'Generated!',
            error: renderToastError,
        }),
    });

    function newLink() {
        if (result === undefined) return;

        genToken.mutate(result.ID);
    }

    return (
        <div>
            <h3 className='mb-4 text-2xl'>Create Sign-up Link</h3>
            <p className='mb-4'>Generate a one-time sign-up link for an existing user. Anyone with the link can create a password for the listed username.</p>
            <div className='mb-4'>
                <FormInputLabel htmlFor='tokenReceiver'>User:</FormInputLabel>
                <UserSearchBox setResult={setResult} id='tokenReceiver' />
                <PrimaryButton onClick={newLink} disabled={genToken.status === 'loading'}>Generate</PrimaryButton>
            </div>
            <p>Links:</p>
            <div className='flex flex-col gap-4'>
                {(tokens !== undefined)
                    ? tokens.map((token) => <Token token={token} key={token.Token} />)
                    : <LoadingSpinner />
                }
            </div>
        </div>
    );
}