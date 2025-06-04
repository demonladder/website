import { useState } from 'react';
import Heading2 from '../../../components/headings/Heading2';
import PageButtons from '../../../components/PageButtons';
import { useAccessTokens } from './hooks/useAccessTokens';
import { SecondaryButton } from '../../../components/ui/buttons/SecondaryButton';
import useUserSearch from '../../../hooks/useUserSearch';
import { PrimaryButton } from '../../../components/ui/buttons/PrimaryButton';
import { toast } from 'react-toastify';
import { generateToken } from './api/generateToken';
import { useMutation } from '@tanstack/react-query';
import { revokeToken } from './api/revokeToken';
import { AxiosError } from 'axios';
import renderToastError from '../../../utils/renderToastError';

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

    async function onRevokeToken(tokenID: number) {
        await revokeToken(tokenID);
        await refetchTokens();
        toast.success('Token revoked successfully');
    }

    const generateMutation = useMutation({
        mutationFn: onGrantAccess,
        onError: (error: AxiosError) => void toast.error(renderToastError.render({ data: error })),
    });

    const revokeMutation = useMutation({
        mutationFn: onRevokeToken,
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
                    <p className='text-green-500'>Token generated: <span className='font-bold'>{generatedToken}</span></p>
                    <p>Share this token with the user to grant them access.</p>
                    <p>This token will not appear again if you click away!</p>
                </div>
            )}
            {status === 'success' && (
                <div className='mt-6'>
                    <div className='flex flex-wrap gap-8'>
                        {accessTokens.tokens.map((token) => (
                            <div className='flex gap-2 bg-theme-700 px-4 py-2 rounded-xl'>
                                <object data={`https://cdn.discordapp.com/avatars/${token.Owner.DiscordData?.ID ?? '-'}/${token.Owner.DiscordData?.Avatar ?? '-'}.png`} type='image/png' className='rounded-full size-20'>
                                    <i className='bx bxs-user-circle text-[5rem]' />
                                </object>
                                <div className='flex flex-col justify-evenly gap-2 py-2' key={token.ID}>
                                    <p>{token.Owner.Name}</p>
                                    <SecondaryButton onClick={() => revokeMutation.mutate(token.ID)} loading={revokeMutation.isPending}>Remove</SecondaryButton>
                                </div>
                            </div>
                        ))}
                    </div>
                    <PageButtons onPageChange={setPage} meta={{ limit: accessTokens.limit, page, total: accessTokens.total }} />
                </div>
            )}
        </section>
    );
}
