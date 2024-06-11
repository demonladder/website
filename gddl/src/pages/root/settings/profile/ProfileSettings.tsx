import { useEffect, useRef } from 'react';
import { useQuery } from '@tanstack/react-query';
import { GetUser } from '../../../../api/users';
import StorageManager from '../../../../utils/StorageManager';
import { DiscordLink } from '../../../../components/Button';
import DiscordProfilePicture from '../../../../components/DiscordProfilePicture';
import { LoginButton } from '../../login/ProfileButtons';
import GeneralInformation from './GeneralInformation';
//import useLevelSearch from '../../../../hooks/useLevelSearch';

export default function ProfileSettings() {
    const hasSession = StorageManager.hasSession();
    const userID = StorageManager.getUser()?.ID;

    const { data, status } = useQuery({
        queryKey: ['user', userID],
        queryFn: () => GetUser(userID || 0),
        enabled: hasSession,
    });

    const introductionRef = useRef<HTMLTextAreaElement>(null);
    //const { activeLevel: favoriteLevel, SearchBox: FavoriteSearchBox } = useLevelSearch({ ID: 'profileFavorite', options: {  } });
    const favoriteRef = useRef<HTMLInputElement>(null);
    const leastFavoriteRef = useRef<HTMLInputElement>(null);

    const minPrefRef = useRef<HTMLInputElement>(null);
    const maxPrefRef = useRef<HTMLInputElement>(null);

    useEffect(() => {
        if (data === undefined) return;

        if (introductionRef.current && data.Introduction) introductionRef.current.value = ''+data.Introduction;
        if (favoriteRef.current && data.Favorite) favoriteRef.current.value = ''+data.Favorite;
        if (leastFavoriteRef.current && data.LeastFavorite) leastFavoriteRef.current.value = ''+data.LeastFavorite;
        if (minPrefRef.current && data.MinPref) minPrefRef.current.value = ''+data.MinPref;
        if (maxPrefRef.current && data.MaxPref) maxPrefRef.current.value = ''+data.MaxPref;
    }, [data]);

    if (status === 'loading') {
        return (
            <main>
                <h2 className='text-3xl mb-4'>Profile settings</h2>
                <p>You are not logged in</p>
                <LoginButton />
            </main>
        );
    } else if (status === 'error') {
        return (
            <main>
                <h1 className='text-4xl'>An error occurred</h1>
            </main>
        );
    }

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