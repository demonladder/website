import { useEffect, useRef } from 'react';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import { GetUser, SaveProfile } from '../../../../api/users';
import Container from '../../../../components/Container';
import { NumberInput } from '../../../../components/Input';
import storageManager from '../../../../utils/storageManager';
import { PrimaryButton } from '../../../../components/Button';
import TextArea from '../../../../components/input/TextArea';
import FormGroup from '../../../../components/form/FormGroup';
import LoadingSpinner from '../../../../components/LoadingSpinner';
import { toast } from 'react-toastify';

export default function Settings() {
    const hasSession = storageManager.hasSession();
    const userID = storageManager.getUser()?.ID;

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

    // const pfpInputRef = useRef<HTMLInputElement>(null);
    // const pfpRef = useRef<HTMLImageElement>(null);

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

        toast.promise(SaveProfile(newUser).then(() => queryClient.invalidateQueries(['user', userID])), {
            pending: 'Saving...',
            success: 'Saved!',
            error: 'An error occurred',
        });

        // const pfp = pfpInputRef.current?.files?.[0] || undefined;

        // if (pfp) {
        //     toast.promise(UploadPFP(pfp), {
        //         pending: 'Uploading pfp...',
        //         success: 'Updated pfp!',
        //         error: 'Couldn\'t upload pfp',
        //     });
        // }
    }

    // function pfpChange(e: React.ChangeEvent<HTMLInputElement>) {
    //     const file = e.target.files?.[0];

    //     if (!file) return;
    //     if (file.size > 512 * 1024) {
    //         return toast.error('Image too large! Maximum size is 512KB.');
    //     }

    //     const blob = URL.createObjectURL(file);
    //     if (pfpRef.current) pfpRef.current.src = blob;
    // }

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
            <section>
                <h1 className='text-4xl'>Profile settings</h1>
            </section>
            {hasSession &&
                <section className='mt-4'>
                    <form>
                        <FormGroup>
                            <label className='font-bold block mb-1'>Introduction</label>
                            <TextArea spellCheck={false} ref={introductionRef} />
                            <p className='text-gray-400 mt-1 text-sm'>Your introduction will be visible to everyone visiting your profile.</p>
                        </FormGroup>
                        {/* <FormGroup>
                            <label className='font-bold'>Profile picture</label>
                            <input className='block' type='file' accept='image/*' ref={pfpInputRef} onChange={(e) => pfpChange(e)} />
                            <img id='newPFPSetting' className='w-64 rounded-full' ref={pfpRef} alt='' />
                        </FormGroup> */}
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
                        <PrimaryButton type='submit' onClick={onSave}>Save</PrimaryButton>
                    </form>
                </section>
            }
        </Container>
    );
}