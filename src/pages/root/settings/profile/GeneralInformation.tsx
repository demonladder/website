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
import SaveProfile from '../../../../api/user/SaveProfile';
import FormInputDescription from '../../../../components/form/FormInputDescription';
import FormInputLabel from '../../../../components/form/FormInputLabel';

export default function GeneralInformation({ userID }: { userID: number }) {
    const hasSession = StorageManager.hasSession();

    const [isMutating, setIsMutating] = useState(false);

    const { data, status, invalidate: invalidateUser } = useUserQuery(userID, { enabled: hasSession });

    const [name, setName] = useState('');
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

        setName(data.Name);
        if (introductionRef.current && data.Introduction) introductionRef.current.value = '' + data.Introduction;
        if (minPrefRef.current && data.MinPref) minPrefRef.current.value = data.MinPref.toString();
        if (maxPrefRef.current && data.MaxPref) maxPrefRef.current.value = data.MaxPref.toString();
    }, [data]);

    function onSave(e: React.MouseEvent) {
        e.preventDefault();
        if (isMutating) return;

        if (!data) return;

        if (!introductionRef.current) return;
        if (!minPrefRef.current) return;
        if (!maxPrefRef.current) return;

        const newUser = {
            name: name,
            introduction: introductionRef.current.value || null,
            hardest: hardestSearch.activeLevel?.ID,
            favoriteLevels: [
                favoriteLevelSearch1.activeLevel?.ID,
                favoriteLevelSearch2.activeLevel?.ID,
            ].filter((v) => v !== undefined).join(',') || null,
            leastFavoriteLevels: [
                leastFavoriteLevelSearch1.activeLevel?.ID,
                leastFavoriteLevelSearch2.activeLevel?.ID,
            ].filter((v) => v !== undefined).join(','),
            minPref: parseInt(minPrefRef.current.value) || null,
            maxPref: parseInt(maxPrefRef.current.value) || null,
        };

        setIsMutating(true);
        void toast.promise(SaveProfile(userID, newUser).then(invalidateUser).finally(() => setIsMutating(false)), {
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
                <FormInputLabel>Your name</FormInputLabel>
                <TextInput value={name} onChange={(e) => setName(e.target.value)} invalid={!name.match(/^[a-zA-Z0-9._]{0,32}$/)} />
            </FormGroup>
            <FormGroup>
                <FormInputLabel>Introduction</FormInputLabel>
                <TextArea spellCheck={false} ref={introductionRef} />
                <FormInputDescription>Your introduction is visible to everyone visiting your profile.</FormInputDescription>
            </FormGroup>
            <FormGroup>
                <FormInputLabel>Hardest level</FormInputLabel>
                <div className='mb-2'>
                    {hardestSearch.SearchBox}
                </div>
            </FormGroup>
            <FormGroup>
                <FormInputLabel>Favorite levels</FormInputLabel>
                <div className='mb-2'>
                    {favoriteLevelSearch1.SearchBox}
                </div>
                <div className='mb-2'>
                    {favoriteLevelSearch2.SearchBox}
                </div>
            </FormGroup>
            <FormGroup>
                <FormInputLabel>Least favorite level</FormInputLabel>
                <div className='mb-2'>
                    {leastFavoriteLevelSearch1.SearchBox}
                </div>
                <div className='mb-2'>
                    {leastFavoriteLevelSearch2.SearchBox}
                </div>
            </FormGroup>
            <FormGroup>
                <FormInputLabel>Tier preference</FormInputLabel>
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