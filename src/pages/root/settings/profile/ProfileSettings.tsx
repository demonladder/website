import StorageManager from '../../../../utils/StorageManager';
import { DiscordLink } from '../../../../components/Button';
import DiscordProfilePicture from '../../../../components/DiscordProfilePicture';
import { LoginButton } from '../../login/ProfileButtons';
import GeneralInformation from './GeneralInformation';

export default function ProfileSettings() {
    const hasSession = StorageManager.hasSession();
    const userID = StorageManager.getUser()?.ID;

    return (
        <main>
            <h2 className='text-3xl'>Profile settings</h2>
            {!hasSession &&
                <>
                    <p>You shouldn't be here</p>
                    <LoginButton />
                </>
            }
            {hasSession && userID &&
                <section>
                    <div className='flex max-md:flex-col-reverse gap-2'>
                        <div className='md:w-2/3'>
                            <GeneralInformation userID={userID} />
                        </div>
                        <div className='md:w-1/3 round:rounded-lg md:px-4 py-2'>
                            <p className='mb-2 text-lg'>Profile image</p>
                            <div className='mb-2'>
                                <DiscordProfilePicture userID={userID} />
                            </div>
                            <DiscordLink href={import.meta.env.VITE_DISCORD_OAUTH}>Sync to Discord</DiscordLink>
                            <p className='text-sm text-gray-400'>By syncing your account, GDDL will use your discord pfp instead of a demon face of your hardest.</p>
                        </div>
                    </div>
                </section>
            }
        </main>
    );
}