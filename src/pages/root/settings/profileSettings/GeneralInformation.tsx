import { useState, useEffect, useRef, useId } from 'react';
import { NumberInput, TextInput } from '../../../../components/Input';
import { PrimaryButton } from '../../../../components/ui/buttons/PrimaryButton';
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
import { useMutation } from '@tanstack/react-query';
import Heading1 from '../../../../components/headings/Heading1';
import LoadingSpinner from '../../../../components/LoadingSpinner';
import useSession from '../../../../hooks/useSession';

const pronounOptions = {
    '-': 'Select your pronouns',
    'he/him': 'he/him',
    'she/her': 'she/her',
    'they/them': 'they/them',
    'xe/xem': 'xe/xem',
    'ze/zir': 'ze/zir',
    'it/its': 'it/its',
    'other': 'Other',
} as const;
type PronounOptionKey = keyof typeof pronounOptions;

const countryOptions = {
    '-': 'Select your country',
    ...ISO3611Alpha2,
} as const;
type CountryOptionKey = keyof typeof countryOptions;

export default function GeneralInformation({ userID }: { userID: number }) {
    const session = useSession();

    const { data, status, refetch: invalidateUser } = useUserQuery(userID, { enabled: session.user !== undefined });

    const [name, setName] = useState('');
    const introductionRef = useRef<HTMLTextAreaElement>(null);
    const [countryKey, setCountryKey] = useState<CountryOptionKey>('-');
    const [pronounKey, setPronounKey] = useState<PronounOptionKey>('-');
    const pronounSelectID = useId();
    const [customPronouns, setCustomPronouns] = useState('');
    const countrySelectID = useId();

    const hardestSearch = useLevelSearch({ ID: 'profileSettingsHardest', options: { defaultLevel: data?.HardestID } });

    const favoriteLevelSearch1 = useLevelSearch({ ID: 'profileFavorite1', options: { defaultLevel: data?.Favorite[0] } });
    const favoriteLevelSearch2 = useLevelSearch({ ID: 'profileFavorite2', options: { defaultLevel: data?.Favorite[1] } });

    const leastFavoriteLevelSearch2 = useLevelSearch({ ID: 'profileLeastFavorite2', options: { defaultLevel: data?.LeastFavorite[1] } });
    const leastFavoriteLevelSearch1 = useLevelSearch({ ID: 'profileLeastFavorite1', options: { defaultLevel: data?.LeastFavorite[0] } });

    const minPrefRef = useRef<HTMLInputElement>(null);
    const maxPrefRef = useRef<HTMLInputElement>(null);

    useEffect(() => {
        if (data === undefined) return;

        setName(data.Name);
        if (introductionRef.current && data.Introduction) introductionRef.current.value = '' + data.Introduction;

        if (data.Pronouns) {
            if (data.Pronouns !== 'other' && data.Pronouns !== '-') {
                setPronounKey(data.Pronouns as PronounOptionKey);
            } else {
                setPronounKey('other');
                setCustomPronouns(data.Pronouns);
            }
        } else {
            setPronounKey('-');
        }

        if (data.CountryCode) setCountryKey(data.CountryCode as CountryOptionKey);
        else setCountryKey('-');

        if (minPrefRef.current && data.MinPref) minPrefRef.current.value = data.MinPref.toString();
        if (maxPrefRef.current && data.MaxPref) maxPrefRef.current.value = data.MaxPref.toString();
    }, [data]);

    const updateMutation = useMutation(SaveProfile, {
        onSuccess: async () => {
            await invalidateUser();
            toast.success('Profile updated successfully!');
        },
        onError: (error: Error) => toast.error(renderToastError.render({ data: error })),
    });

    function onSave(e: React.FormEvent) {
        e.preventDefault();
        if (!data) return;

        if (!introductionRef.current) return;
        if (!minPrefRef.current) return;
        if (!maxPrefRef.current) return;

        const pronouns = (() => {
            if (pronounKey === 'other') return customPronouns;
            if (pronounKey === '-') return null;
            return pronounKey;
        })();

        updateMutation.mutate({
            ID: userID,
            name: name,
            introduction: introductionRef.current.value || null,
            pronouns,
            countryCode: countryKey === '-' ? null : countryKey,
            hardest: hardestSearch.activeLevel?.ID ?? null,
            favoriteLevels: [
                favoriteLevelSearch1.activeLevel?.ID,
                favoriteLevelSearch2.activeLevel?.ID,
            ].filter((v) => v !== undefined) || null,
            leastFavoriteLevels: [
                leastFavoriteLevelSearch1.activeLevel?.ID,
                leastFavoriteLevelSearch2.activeLevel?.ID,
            ].filter((v) => v !== undefined) || null,
            minPref: parseInt(minPrefRef.current.value) || null,
            maxPref: parseInt(maxPrefRef.current.value) || null,
        });
    }

    if (status === 'loading') return <LoadingSpinner />;
    if (status === 'error') return <div><Heading1>An error occurred</Heading1></div>;

    return (
        <form onSubmit={onSave}>
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
            <div className='border-b border-b-theme-500 my-12' />
            <FormGroup>
                <FormInputLabel>Hardest level</FormInputLabel>
                {hardestSearch.SearchBox}
                <FormInputDescription>What is the hardest level you have completed? Does not automatically update!</FormInputDescription>
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
            <PrimaryButton type='submit' loading={updateMutation.isLoading}>Update</PrimaryButton>
        </form>
    );
}
