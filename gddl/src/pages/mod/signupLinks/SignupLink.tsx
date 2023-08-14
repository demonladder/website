import { useState} from 'react';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { GetSignupTokens, SignupToken, TokenPair } from '../../../api/signupLinks';
import LoadingSpinner from '../../../components/LoadingSpinner';
import UserSearchBox from '../../../components/UserSearchBox';
import { TinyUser } from '../../../api/users';
import { PrimaryButton } from '../../../components/Button';

function Token({ token }: { token: TokenPair }) {
    const link = 'https://gdladder.com/signup?key=' + token.Token + '&name=' + token.UserName;

    function linkClick(e: any) {
        navigator.clipboard.writeText(link);

        e.target.classList.remove('bg-fade');
        setTimeout(() => {
            e.target.classList.add('bg-fade');
        }, 10);
    }

    return (
        <div>
            <b className='block'>{token.UserName}:</b>
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
        mutationFn: async (context: string) => {
            await SignupToken(context);
            queryClient.invalidateQueries(['signupTokens']);
        },
    });

    function newLink() {
        if (result === undefined) return;
        
        genToken.mutate(result.Name);
    }

    return (
        <div>
            <h3 className='mb-4 text-2xl'>Create Sign-up Link</h3>
            <p className='mb-4'>Generate a one-time sign-up link for an existing user. Anyone with the link can create a password for the listed username.</p>
            <div className='mb-4'>
                <label htmlFor='tokenReceiver'>User:</label>
                <UserSearchBox setResult={setResult} id='tokenReceiver' />
                <PrimaryButton onClick={newLink}>Generate</PrimaryButton>
            </div>
            {genToken.isLoading && <LoadingSpinner />}
            <div className='flex flex-col gap-4'>
                {(tokens !== undefined) ?
                    tokens.map((token) => <Token token={token} key={token.Token} />) :
                    <LoadingSpinner />
                }
            </div>
        </div>
    );
}