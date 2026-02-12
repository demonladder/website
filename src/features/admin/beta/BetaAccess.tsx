import { useState } from 'react';
import { Heading2 } from '../../../components/headings';
import PageButtons from '../../../components/shared/PageButtons';
import { useAccessTokens } from './hooks/useAccessTokens';
import useUserSearch from '../../../hooks/useUserSearch';
import { PrimaryButton } from '../../../components/ui/buttons/PrimaryButton';
import { toast } from 'react-toastify';
import { generateToken } from './api/generateToken';
import { useMutation } from '@tanstack/react-query';
import { AxiosError } from 'axios';
import renderToastError from '../../../utils/renderToastError';
import AccessToken from './components/AccessToken';
import { selectText } from '../../../utils/selectText';

export default function BetaAccess() {
    const { data: accessTokens, status, refetch: refetchTokens } = useAccessTokens();
    const [page, setPage] = useState(0);
    const [generatedToken, setGeneratedToken] = useState<string>();

    const userSearch = useUserSearch({
        ID: 'userSearch',
    });

    async function onGrantAccess() {
        if (!userSearch.activeUser) return toast.error('No user selected');

        const token = await generateToken(userSearch.activeUser.ID);
        setGeneratedToken(token);
        await refetchTokens();
    }

    const generateMutation = useMutation({
        mutationFn: onGrantAccess,
        onError: (error: AxiosError) => void toast.error(renderToastError.render({ data: error })),
    });

    return (
        <section>
            <Heading2>Beta Access</Heading2>
            <p>Control who can access <b>beta.gdladder.com</b></p>
            <div>
                {userSearch.SearchBox}
                <PrimaryButton onClick={() => generateMutation.mutate()} loading={generateMutation.isPending}>Grant access</PrimaryButton>
            </div>
            {generatedToken && (
                <div className='mt-3'>
                    <p className='text-green-500'>Token generated: <code className='bg-theme-950 px-2 py-1 rounded-lg outline' onClick={selectText}>{generatedToken}</code></p>
                    <p>Share this token with the user to grant them access.</p>
                    <p>For security reasons, this token <b>will not appear again</b> when you click away!</p>
                </div>
            )}
            {status === 'success' && (
                <div className='mt-6'>
                    <PageButtons onPageChange={setPage} page={page} limit={accessTokens.limit} total={accessTokens.total} />
                    <div className='flex flex-wrap gap-8'>
                        {accessTokens.tokens.map((token) => (
                            <AccessToken token={token} key={token.ID} />
                        ))}
                    </div>
                    <PageButtons onPageChange={setPage} page={page} limit={accessTokens.limit} total={accessTokens.total} />
                </div>
            )}
        </section>
    );
}
