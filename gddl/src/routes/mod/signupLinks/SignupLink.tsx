import { useState} from 'react';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { GetSignupTokens, SignupToken, TokenPair } from '../../../api/signupLinks';
import LoadingSpinner from '../../../components/LoadingSpinner';
import UserSearchBox from '../../../components/UserSearchBox';
import { TinyUser } from '../../../api/users';
import { randomBytes } from '../../../functions';

function Token({ token }: { token: TokenPair }) {
    const link = 'https://gdladder.com/signup?key=' + token.Token + '&name=' + token.UserName;

    function linkClick(e: any ) {
        navigator.clipboard.writeText(link);

        e.target.classList.remove('bg-fade');
        setTimeout(() => {
            e.target.classList.add('bg-fade');
        }, 10);
    }

    return (
        <div>
            <b className='mb-0'>{token.UserName}:</b>
            <p className='text-break cursor-pointer underline' onClick={(e) => linkClick(e)}>{link}</p>
        </div>
    );
}

export default function SignupLink() {
    const [result, setResult] = useState<TinyUser>();

    const { data: tokens } = useQuery({
        queryKey: ['signupTokens'],
        queryFn: GetSignupTokens,
    });

    const queryClient = useQueryClient();
    const genToken = useMutation({
        mutationFn: async (context: TokenPair) => {
            await SignupToken(context);
            queryClient.invalidateQueries(['signupTokens']);
        },
    });

    function newLink() {
        if (result === undefined) return;
        
        const token = randomBytes(32);
        genToken.mutate({ Token: token, UserName: result.Name });
    }

    return (
        <div>
            <h3 className='mb-3'>Get Sign-up Link</h3>
            <p className='mb-3'>Generate a one-time sign-up link for an existing user. Anyone with the link can create a password for the listed username.</p>
            <div className='mb-3'>
                <label htmlFor='tokenReceiver'>User:</label>
                <UserSearchBox setResult={setResult} id='tokenReceiver' />
                <button className='primary' onClick={newLink}>Generate</button>
            </div>
            {genToken.isLoading && <LoadingSpinner />}
            <div>
                {(tokens !== undefined &&
                    tokens.map((token) => <Token token={token} key={token.Token} />))
                ||
                <LoadingSpinner />
                }
            </div>
        </div>
    );
}