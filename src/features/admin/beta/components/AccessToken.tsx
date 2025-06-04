import { useMutation, useQueryClient } from '@tanstack/react-query';
import Heading3 from '../../../../components/headings/Heading3';
import { SecondaryButton } from '../../../../components/ui/buttons/SecondaryButton';
import pluralS from '../../../../utils/pluralS';
import { revokeToken } from '../api/revokeToken';
import { toast } from 'react-toastify';
import { AxiosError } from 'axios';
import renderToastError from '../../../../utils/renderToastError';
import { useUserColor } from '../../../../hooks/useUserColor';

interface Props {
    token: {
        ID: number;
        Owner: {
            Name: string;
            RoleIDs: string;
            DiscordData?: {
                ID: string;
                Avatar?: string;
            };
        };
        uses: number;
    };
}

export default function AccessToken({ token }: Props) {
    const queryClient = useQueryClient();
    const userColor = useUserColor(token.Owner.RoleIDs);

    async function onRevokeToken(tokenID: number) {
        await revokeToken(tokenID);
        await queryClient.invalidateQueries({ queryKey: ['accessTokens'] });
        toast.success('Token revoked successfully');
    }

    const revokeMutation = useMutation({
        mutationFn: onRevokeToken,
        onError: (error: AxiosError) => void toast.error(renderToastError.render({ data: error })),
    });

    return (
        <div className='flex gap-2 bg-theme-700 shadow-lg px-4 py-2 rounded-xl'>
            <object data={`https://cdn.discordapp.com/avatars/${token.Owner.DiscordData?.ID ?? '-'}/${token.Owner.DiscordData?.Avatar ?? '-'}.png`} type='image/png' className='rounded-full size-28'>
                <i className='bx bxs-user-circle text-[7rem]' />
            </object>
            <div className='flex flex-col justify-evenly gap-2 py-2'>
                <Heading3><span style={{ color: `#${userColor?.toString(16).padStart(6, '0')}` }}>{token.Owner.Name}</span> <span className='text-base'>(keyID: {token.ID})</span></Heading3>
                <p>{token.uses} use{pluralS(token.uses)}</p>
                <SecondaryButton onClick={() => revokeMutation.mutate(token.ID)} loading={revokeMutation.isPending}>Remove</SecondaryButton>
            </div>
        </div>
    );
}
