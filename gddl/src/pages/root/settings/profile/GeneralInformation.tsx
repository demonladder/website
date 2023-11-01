import { useState, useEffect, useRef } from 'react';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import { GetUser, SaveProfile } from '../../../../api/users';
import { NumberInput, TextInput } from '../../../../components/Input';
import StorageManager from '../../../../utils/StorageManager';
import { PrimaryButton } from '../../../../components/Button';
import TextArea from '../../../../components/input/TextArea';
import FormGroup from '../../../../components/form/FormGroup';
import { toast } from 'react-toastify';
import renderToastError from '../../../../utils/renderToastError';
import useLevelSearch from '../../../../hooks/useLevelSearch';
import { validateUsername } from '../../signup/SignUp';

export default function GeneralInformation() {
    const hasSession = StorageManager.hasSession();
    const userID = StorageManager.getUser()?.ID;

    const [isMutating, setIsMutating] = useState(false);
    const queryClient = useQueryClient();

    const { data, status } = useQuery({
        queryKey: ['user', userID],
        queryFn: () => GetUser(userID || 0),
        enabled: hasSession,
    });

    const nameRef = useRef<HTMLInputElement>(null);
    const [invalidName, setInvalidName] = useState(false);
    const introductionRef = useRef<HTMLTextAreaElement>(null);

    const favoriteLevelSearch1 = useLevelSearch({ ID: 'profileFavorite1', options: { defaultLevel: data?.FavoriteLevels[0] } });
    const favoriteLevelSearch2 = useLevelSearch({ ID: 'profileFavorite2', options: { defaultLevel: data?.FavoriteLevels[1] } });
    
    const leastFavoriteLevelSearch2 = useLevelSearch({ ID: 'profileLeastFavorite2', options: { defaultLevel: data?.LeastFavoriteLevels[1] } });
    const leastFavoriteLevelSearch1 = useLevelSearch({ ID: 'profileLeastFavorite1', options: { defaultLevel: data?.LeastFavoriteLevels[0] } });

    const minPrefRef = useRef<HTMLInputElement>(null);
    const maxPrefRef = useRef<HTMLInputElement>(null);

    useEffect(() => {
        if (data === undefined) return;
        
        if (nameRef.current) nameRef.current.value = data.Name;
        if (introductionRef.current && data.Introduction) introductionRef.current.value = ''+data.Introduction;
        if (minPrefRef.current && data.MinPref) minPrefRef.current.value = ''+data.MinPref;
        if (maxPrefRef.current && data.MaxPref) maxPrefRef.current.value = ''+data.MaxPref;
    }, [data]);
    
    function onSave(e: React.MouseEvent) {
        e.preventDefault();
        if (isMutating) return;

        if (!data) return;

        if (!introductionRef.current) return;
        if (!minPrefRef.current) return;
        if (!maxPrefRef.current) return;
        if (!nameRef.current) return;

        if (!validateUsername(nameRef.current.value)) {
            // Username is invalid
            setInvalidName(true);

            toast.error('Invalid name');
            return;
        }

        const newUser = {
            Name: nameRef.current.value,
            Introduction: introductionRef.current.value,
            FavoriteLevels: [
                favoriteLevelSearch1.activeLevel?.LevelID,
                favoriteLevelSearch2.activeLevel?.LevelID,
            ].filter((v) => v !== undefined).join(','),
            LeastFavoriteLevels: [
                leastFavoriteLevelSearch1.activeLevel?.LevelID,
                leastFavoriteLevelSearch2.activeLevel?.LevelID,
            ].filter((v) => v !== undefined).join(','),
            MinPref: parseInt(minPrefRef.current.value) || undefined,
            MaxPref: parseInt(maxPrefRef.current.value) || undefined,
        };

        setIsMutating(true);
        toast.promise(SaveProfile(newUser).then(() => queryClient.invalidateQueries(['user', userID])).finally(() => setIsMutating(false)), {
            pending: 'Saving...',
            success: 'Saved!',
            error: renderToastError,
        });
    }

    if (status === 'loading') {
        return;
    } else if (status === 'error') {
        return (
            <div>
                <h1 className='text-4xl'>An error occurred</h1>
            </div>
        );
    }

    return (
        <form>
            <FormGroup>
                <label className='font-bold block mb-1'>Your name</label>
                <TextInput ref={nameRef} onChange={() => setInvalidName(false)} invalid={invalidName} />
            </FormGroup>
            <FormGroup>
                <label className='font-bold block mb-1'>Introduction</label>
                <TextArea spellCheck={false} ref={introductionRef} />
                <p className='text-gray-400 mt-1 text-sm'>Your introduction is visible to everyone visiting your profile.</p>
            </FormGroup>
            <FormGroup>
                <label className='font-bold block mb-1'>Favorite levels</label>
                <div className='mb-2'>
                    {favoriteLevelSearch1.SearchBox}
                </div>
                <div className='mb-2'>
                    {favoriteLevelSearch2.SearchBox}
                </div>
            </FormGroup>
            <FormGroup>
                <label className='font-bold'>Least favorite level</label>
                <div className='mb-2'>
                    {leastFavoriteLevelSearch1.SearchBox}
                </div>
                <div className='mb-2'>
                    {leastFavoriteLevelSearch2.SearchBox}
                </div>
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
            <PrimaryButton type='submit' onClick={onSave} disabled={isMutating}>Update</PrimaryButton>
        </form>
    );
}