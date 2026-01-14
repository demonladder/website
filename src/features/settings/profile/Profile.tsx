import { LoginButton } from '../../../components/shared/ProfileButtons';
import useSession from '../../../hooks/useSession';
import GeneralInformation from './components/GeneralInformation';
import DiscordSync from './components/DiscordSync';
import Heading1 from '../../../components/headings/Heading1';

export default function ProfileSettings() {
    const session = useSession();

    return (
        <section>
            <Heading1>Profile settings</Heading1>
            {!session.user
                ? <>
                    <p>You shouldn't be here</p>
                    <LoginButton />
                </>
                : <>
                    <div className='flex max-md:flex-col-reverse gap-2'>
                        <div className='md:w-3/4'>
                            <GeneralInformation userID={session.user.ID} />
                        </div>
                        <div className='md:w-1/4 round:rounded-lg md:px-4 py-2'>
                            <DiscordSync />
                        </div>
                    </div>
                </>
            }
        </section>
    );
}
