import { useState, useEffect, useRef } from 'react';
import { NumberInput, TextInput } from '../../../../components/Input';
import StorageManager from '../../../../utils/StorageManager';
import { PrimaryButton } from '../../../../components/Button';
import TextArea from '../../../../components/input/TextArea';
import FormGroup from '../../../../components/form/FormGroup';
import { toast } from 'react-toastify';
import renderToastError from '../../../../utils/renderToastError';
import useLevelSearch from '../../../../hooks/useLevelSearch';
import useUserQuery from '../../../../hooks/queries/useUserQuery';
import SaveProfile from '../../../../api/user/EdittableUser';

export default function GeneralInformation({ userID }: { userID: number }) {
    const hasSession = StorageManager.hasSession();

    const [isMutating, setIsMutating] = useState(false);

    const { data, status, invalidate: invalidateUser } = useUserQuery(userID, { enabled: hasSession });

    const nameRef = useRef<HTMLInputElement>(null);
    const [invalidName, setInvalidName] = useState(false);
    const introductionRef = useRef<HTMLTextAreaElement>(null);

    const hardestSearch = useLevelSearch({ ID: 'profileSettingsHardest', options: { defaultLevel: data?.HardestID } });

    const favoriteLevelSearch1 = useLevelSearch({ ID: 'profileFavorite1', options: { defaultLevel: data?.FavoriteLevels[0] } });
    const favoriteLevelSearch2 = useLevelSearch({ ID: 'profileFavorite2', options: { defaultLevel: data?.FavoriteLevels[1] } });

    const leastFavoriteLevelSearch2 = useLevelSearch({ ID: 'profileLeastFavorite2', options: { defaultLevel: data?.LeastFavoriteLevels[1] } });
    const leastFavoriteLevelSearch1 = useLevelSearch({ ID: 'profileLeastFavorite1', options: { defaultLevel: data?.LeastFavoriteLevels[0] } });

    const minPrefRef = useRef<HTMLInputElement>(null);
    const maxPrefRef = useRef<HTMLInputElement>(null);

    useEffect(() => {
        if (data === undefined) return;

        if (nameRef.current) nameRef.current.value = data.Name;
        if (introductionRef.current && data.Introduction) introductionRef.current.value = '' + data.Introduction;
        if (minPrefRef.current && data.MinPref) minPrefRef.current.value = '' + data.MinPref;
        if (maxPrefRef.current && data.MaxPref) maxPrefRef.current.value = '' + data.MaxPref;
    }, [data]);

    function onSave(e: React.MouseEvent) {
        e.preventDefault();
        if (isMutating) return;

        if (!data) return;

        if (!introductionRef.current) return;
        if (!minPrefRef.current) return;
        if (!maxPrefRef.current) return;
        if (!nameRef.current) return;

        const newUser = {
            name: nameRef.current.value,
            introduction: introductionRef.current.value || null,
            hardest: hardestSearch.activeLevel?.ID,
            favoriteLevels: [
                favoriteLevelSearch1.activeLevel?.ID,
                favoriteLevelSearch2.activeLevel?.ID,
            ].filter((v) => v !== undefined).join(','),
            leastFavoriteLevels: [
                leastFavoriteLevelSearch1.activeLevel?.ID,
                leastFavoriteLevelSearch2.activeLevel?.ID,
            ].filter((v) => v !== undefined).join(','),
            minPref: parseInt(minPrefRef.current.value) || null,
            maxPref: parseInt(maxPrefRef.current.value) || null,
        };

        setIsMutating(true);
        toast.promise(SaveProfile(userID, newUser).then(invalidateUser).finally(() => setIsMutating(false)), {
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
                <label className='font-bold block mb-1'>Hardest level</label>
                <div className='mb-2'>
                    {hardestSearch.SearchBox}
                </div>
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
            </FormGroup>
            <PrimaryButton type='submit' onClick={onSave} disabled={isMutating}>Update</PrimaryButton>
        </form>
    );
}