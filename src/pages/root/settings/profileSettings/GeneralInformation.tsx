import { useState, useEffect, useRef, useId } from 'react';
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
import Select from '../../../../components/Select';
import { ISO3611Alpha2 } from './ISO3611-1-alpha-2';

const basePronouns = {
    'he/him': 'he/him',
    'she/her': 'she/her',
    'they/them': 'they/them',
    'xe/xem': 'xe/xem',
    'ze/zir': 'ze/zir',
    'it/its': 'it/its',
} as Record<string, string>;

const pronounOptions = {
    '-': 'Select your pronouns',
    ...basePronouns,
    'other': 'Other',
} as const;

const countryOptions = {
    '-': 'Select your country',
    ...ISO3611Alpha2,
} as const;

export default function GeneralInformation({ userID }: { userID: number }) {
    const hasSession = StorageManager.hasSession();

    const [isMutating, setIsMutating] = useState(false);

    const { data, status, invalidate: invalidateUser } = useUserQuery(userID, { enabled: hasSession });

    const [name, setName] = useState('');
    const introductionRef = useRef<HTMLTextAreaElement>(null);
    const [countryKey, setCountryKey] = useState('-');
    const [pronounKey, setPronounKey] = useState('-');
    const pronounSelectID = useId();
    const [customPronouns, setCustomPronouns] = useState('');
    const countrySelectID = useId();

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

        if (data.Pronouns) {
            if (basePronouns[data.Pronouns]) {
                setPronounKey(data.Pronouns);
            } else {
                setPronounKey('other');
                setCustomPronouns(data.Pronouns);
            }
        } else {
            setPronounKey('-');
        }

        if (data.CountryCode) setCountryKey(data.CountryCode);
        else setCountryKey('-');

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

        const pronouns = (() => {
            if (pronounKey === 'other') return customPronouns;
            if (pronounKey === '-') return null;
            return pronounKey;
        })();

        const newUser = {
            name: name,
            introduction: introductionRef.current.value || null,
            pronouns,
            countryCode: countryKey === '-' ? null : countryKey,
            hardest: hardestSearch.activeLevel?.ID ?? null,
            favoriteLevels: [
                favoriteLevelSearch1.activeLevel?.ID,
                favoriteLevelSearch2.activeLevel?.ID,
            ].filter((v) => v !== undefined).join(',') || null,
            leastFavoriteLevels: [
                leastFavoriteLevelSearch1.activeLevel?.ID,
                leastFavoriteLevelSearch2.activeLevel?.ID,
            ].filter((v) => v !== undefined).join(',') || null,
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
                <FormInputLabel>Pronouns</FormInputLabel>
                <Select options={pronounOptions} activeKey={pronounKey} onChange={setPronounKey} id={pronounSelectID} />
                {pronounKey === 'other' &&
                    <div className='mt-3'>
                        <TextInput value={customPronouns} onChange={(e) => setCustomPronouns(e.target.value)} placeholder='Please specify...' invalid={customPronouns.length > 20} />
                    </div>
                }
                <FormInputDescription>What are your pronouns?</FormInputDescription>
            </FormGroup>
            <FormGroup>
                <FormInputLabel htmlFor={countrySelectID}>Country</FormInputLabel>
                <Select options={countryOptions} activeKey={countryKey} onChange={setCountryKey} id={countrySelectID} />
                <FormInputDescription>Where are you from?</FormInputDescription>
            </FormGroup>
            <div className='divider my-12' />
            <FormGroup>
                <FormInputLabel>Hardest level</FormInputLabel>
                {hardestSearch.SearchBox}
                <FormInputDescription>What is the hardest level you have completed? Does NOT automatically update!</FormInputDescription>
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
                <FormInputLabel>Least favorite levels</FormInputLabel>
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
