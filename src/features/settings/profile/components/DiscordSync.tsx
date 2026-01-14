import DiscordProfilePicture from '../../../../components/shared/DiscordProfilePicture';
import { DiscordLink } from '../../../../components/ui/buttons/DiscordLink';

export default function DiscordSync() {
    return (
        <div>
            <p className='mb-2 text-lg'>Profile image</p>
            <div className='mb-2'>
                <DiscordProfilePicture />
            </div>
            <DiscordLink>Sync to Discord</DiscordLink>
            <p className='text-sm text-gray-400'>By syncing your account, GDDL will use your discord pfp instead of a demon face of your hardest.</p>
            <p className='text-sm text-gray-400'>GDDL only stores your Discord ID, username, pfp hash and accent color.</p>
            <p className='text-sm text-gray-400'>Should you change any of these, please re-sync in order to reflect the change here.</p>
        </div>
    );
}
