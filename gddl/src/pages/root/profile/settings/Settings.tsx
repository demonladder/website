import { useState, useEffect, useRef } from 'react';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import { GetUser, SaveProfile } from '../../../../api/users';
import Container from '../../../../components/Container';
import { NumberInput } from '../../../../components/Input';
import StorageManager from '../../../../utils/StorageManager';
import { DiscordLink, PrimaryButton } from '../../../../components/Button';
import TextArea from '../../../../components/input/TextArea';
import FormGroup from '../../../../components/form/FormGroup';
import LoadingSpinner from '../../../../components/LoadingSpinner';
import { toast } from 'react-toastify';
import renderToastError from '../../../../utils/renderToastError';
import FloatingLoadingSpinner from '../../../../components/FloatingLoadingSpinner';
import DiscordUser from '../../../../components/DiscordUser';
import { LoginButton } from '../../login/ProfileButtons';

export default function Settings() {
    const hasSession = StorageManager.hasSession();
    const userID = StorageManager.getUser()?.ID;

    const [isMutating, setIsMutating] = useState(false);
    const queryClient = useQueryClient();

    const { data, status } = useQuery({
        queryKey: ['user', userID],
        queryFn: () => GetUser(userID || 0),
        enabled: hasSession,
    });

    const introductionRef = useRef<HTMLTextAreaElement>(null);
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
    
    function onSave(e: React.MouseEvent) {
        e.preventDefault();

        if (!data) return;

        if (!introductionRef.current) return;
        if (!favoriteRef.current) return;
        if (!leastFavoriteRef.current) return;
        if (!minPrefRef.current) return;
        if (!maxPrefRef.current) return;

        const newUser = {
            ID: data.ID,
            Introduction: introductionRef.current.value,
            Favorite: parseInt(favoriteRef.current.value),
            LeastFavorite: parseInt(leastFavoriteRef.current.value),
            MinPref: parseInt(minPrefRef.current.value),
            MaxPref: parseInt(maxPrefRef.current.value),
        };

        setIsMutating(true);
        toast.promise(SaveProfile(newUser).then(() => queryClient.invalidateQueries(['user', userID])).finally(() => setIsMutating(false)), {
            pending: 'Saving...',
            success: 'Saved!',
            error: renderToastError,
        });
    }

    if (!userID) return;

    if (status === 'loading') {
        return (
            <Container>
                <LoadingSpinner />
            </Container>
        );
    } else if (status === 'error') {
        return (
            <Container>
                <h1 className='text-4xl'>An error occurred</h1>
            </Container>
        );
    }

    return (
        <Container>
            <FloatingLoadingSpinner isLoading={isMutating} />
            <section>
                <h1 className='text-4xl'>Profile settings</h1>
            </section>
            {!hasSession &&
                <>
                    <p>You shouldn't be here</p>
                    <LoginButton />
                </>
            }
            {hasSession &&
                <section className='mt-4'>
                    
                    <form>
                        <div className='grid xl:grid-cols-7 gap-4'>
                            <div className='xl:col-span-2 bg-gray-700 round:rounded-lg px-4 py-2'>
                                <DiscordUser userID={userID} />
                                <DiscordLink href={import.meta.env.VITE_DISCORD_OAUTH}>{'Connect'} your Discord account</DiscordLink>
                                <p className='text-sm text-gray-400'>By connecting your account, GDDL will store both your usernames, your pfp and your accent color!</p>
                            </div>
                            <div className='xl:col-span-5'>
                                <label className='font-bold block mb-1'>Introduction</label>
                                <TextArea spellCheck={false} ref={introductionRef} />
                                <p className='text-gray-400 mt-1 text-sm'>Your introduction will be visible to everyone visiting your profile.</p>
                            </div>
                        </div>
                        <FormGroup>
                            <label className='font-bold'>Favorite level</label>
                            <NumberInput ref={favoriteRef} />
                            <p className='text-gray-400 mt-1 text-sm'>Type/paste the ID.</p>
                        </FormGroup>
                        <FormGroup>
                            <label className='font-bold'>Least favorite level</label>
                            <NumberInput ref={leastFavoriteRef} />
                            <p className='text-gray-400 mt-1 text-sm'>Type/paste the ID.</p>
                        </FormGroup>
                        <FormGroup>
                            <label className='font-bold'>Tier preference</label>
                            <div className='flex gap-2'>
                                <NumberInput ref={minPrefRef} />
                                <p>to</p>
                                <NumberInput ref={maxPrefRef} />
                            </div>
                            <p className='text-gray-400 mt-1 text-sm'>You can leave the lower- or upper bound blank if you like.</p>
                        </FormGroup>
                        <PrimaryButton type='submit' onClick={onSave} disabled={isMutating}>Save</PrimaryButton>
                    </form>
                </section>
            }
        </Container>
    );
}