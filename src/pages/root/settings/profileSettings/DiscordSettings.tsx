import { DiscordLink } from '../../../../components/ui/buttons/DiscordLink';
import DiscordProfilePicture from '../../../../components/DiscordProfilePicture';
import { LoginButton } from '../../../../components/ProfileButtons';
import GeneralInformation from './GeneralInformation';
import useSession from '../../../../hooks/useSession';

export default function DiscordSettings() {
    const session = useSession();

    if (!session.user) {
        return (
            <section>
                <h2 className='text-3xl'>Profile settings</h2>
                <p>You shouldn't be here</p>
                <LoginButton />
            </section>
        );
    }

    return (
        <section>
            <h2 className='text-3xl'>Profile settings</h2>
            <div className='flex max-md:flex-col-reverse gap-2'>
                <div className='md:w-2/3'>
                    <GeneralInformation userID={session.user.ID} />
                </div>
                <div className='md:w-1/3 round:rounded-lg md:px-4 py-2'>
                    <p className='mb-2 text-lg'>Profile image</p>
                    <div className='mb-2'>
                        <DiscordProfilePicture />
                    </div>
                    <DiscordLink href={import.meta.env.VITE_DISCORD_OAUTH}>Sync to Discord</DiscordLink>
                    <p className='text-sm text-gray-400'>By syncing your account, GDDL will use your discord pfp instead of a demon face of your hardest.</p>
                    <p className='text-sm text-gray-400'>GDDL only stores your Discord ID, username, pfp hash and accent color.</p>
                    <p className='text-sm text-gray-400'>Should you change any of these, please re-sync in order to reflect the change here.</p>
                </div>
            </div>
        </section>
    );
}
