import { LoginButton } from '../../../components/ProfileButtons';
import useSession from '../../../hooks/useSession';
import GeneralInformation from './components/GeneralInformation';
import DiscordSync from './components/DiscordSync';

export default function ProfileSettings() {
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
                    <DiscordSync />
                </div>
            </div>
        </section>
    );
}
