import { useQueryClient } from '@tanstack/react-query';
import User from '../../../../api/types/User';
import { toast } from 'react-toastify';
import renderToastError from '../../../../utils/renderToastError';
import Heading4 from '../../../../components/headings/Heading4';
import { UserStat } from './UserStat';
import RemoveRoleFromUser from '../../../../api/user/RemoveRoleFromUser';
import { Link } from 'react-router-dom';
import { DangerButton } from '../../../../components/ui/buttons/DangerButton';
import DiscordUserData from '../../../../api/types/DiscordUserData';
import { useVerificationRole } from '../hooks/useVerificationRole';

interface Props {
    user: User & {
        DiscordData: DiscordUserData;
    };
}

export default function VerifiedUser({ user }: Props) {
    const queryClient = useQueryClient();
    const verificationRole = useVerificationRole();

    function onUnverify() {
        if (!verificationRole.data) return toast.error('Verification role not set');

        void toast.promise(RemoveRoleFromUser(user.ID, verificationRole.data.ID).then(() => {
            void queryClient.invalidateQueries({ queryKey: ['verifiedUsers'] });
            void queryClient.invalidateQueries({ queryKey: ['usersEligibleForVerification'] });
            void queryClient.invalidateQueries({ queryKey: ['user', user.ID] });
        }), {
            pending: 'Un-verifying user...',
            success: 'User un-verified!',
            error: renderToastError,
        });
    }

    return (
        <div className='bg-theme-600 px-4 py-2 round:rounded-lg relative'>
            <Heading4 className='flex gap-2'>
                <img src={`https://cdn.discordapp.com/avatars/${user.DiscordData?.ID}/${user.DiscordData?.Avatar}.png`} className='inline-block w-14 h-14 rounded-full' />
                <div className='flex flex-col justify-around'>
                    <Link to={`/profile/${user.ID}`} className='underline'>{user.Name}</Link>
                </div>
            </Heading4>
            <div className='grid grid-cols-2 gap-2 mt-4'>
                <UserStat label='Average enjoyment'>{user.AverageEnjoyment?.toFixed(2) ?? '-'}</UserStat>
            </div>
            <div className='flex mt-4'>
                <DangerButton className='grow' onClick={onUnverify}>Un-verify</DangerButton>
            </div>
        </div>
    );
}
