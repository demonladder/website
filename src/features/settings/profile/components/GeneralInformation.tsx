import { useState, useEffect, useRef, useId } from 'react';
import { NumberInput, TextInput } from '../../../../components/shared/input/Input';
import { PrimaryButton } from '../../../../components/ui/buttons';
import TextArea from '../../../../components/input/TextArea';
import { toast } from 'react-toastify';
import renderToastError from '../../../../utils/renderToastError';
import useLevelSearch from '../../../../hooks/useLevelSearch';
import useUserQuery from '../../../../hooks/queries/useUserQuery';
import { saveProfile } from '../api/saveProfile';
import { FormGroup, FormInputDescription, FormInputLabel } from '../../../../components/form';
import Select from '../../../../components/shared/input/Select';
import { ISO3611Alpha2 } from '../ISO3611-1-alpha-2';
import { useMutation } from '@tanstack/react-query';
import { Heading1 } from '../../../../components/headings';
import LoadingSpinner from '../../../../components/shared/LoadingSpinner';
import useSession from '../../../../hooks/useSession';
import { SearchLevelResponse } from '../../../search/api/getLevels.ts';
import type { UserResponse } from '../../../../api/user/GetUser.ts';
import Markdown from 'react-markdown';
import markdownComponents from '../../../../utils/markdownComponents.tsx';

const pronounOptions = {
    '-': 'Select your pronouns',
    'he/him': 'he/him',
    'she/her': 'she/her',
    'they/them': 'they/them',
    'xe/xem': 'xe/xem',
    'ze/zir': 'ze/zir',
    'it/its': 'it/its',
    other: 'Other',
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

    if (status === 'pending') return <LoadingSpinner />;
    if (status === 'error')
        return (
            <div>
                <p>An error occurred while fetching user data.</p>
            </div>
        );

    return <GeneralInformationPresenter data={data} refetchUser={invalidateUser} userID={userID} key={userID} />;
}

interface GeneralInformationPresenterProps {
    data: UserResponse;
    refetchUser: () => Promise<unknown>;
    userID: number;
}

function GeneralInformationPresenter({ data, refetchUser, userID }: GeneralInformationPresenterProps) {
    const [name, setName] = useState(data.Name);
    const [introduction, setIntroduction] = useState(data.Introduction ?? '');
    const [countryKey, setCountryKey] = useState<CountryOptionKey>((data.CountryCode as CountryOptionKey) ?? '-');
    const [pronounKey, setPronounKey] = useState<PronounOptionKey>(() => {
        if (data.Pronouns) {
            if (data.Pronouns !== '-' && Object.keys(pronounOptions).includes(data.Pronouns))
                return data.Pronouns as PronounOptionKey;
            return 'other';
        }
        return '-';
    });
    const pronounSelectID = useId();
    const [customPronouns, setCustomPronouns] = useState(() => {
        if (data.Pronouns && (data.Pronouns === '-' || !Object.keys(pronounOptions).includes(data.Pronouns)))
            return data.Pronouns;
        return '';
    });
    const arePronounsValid = /^[a-z]{1,6}(\/[a-z]{1,6}){0,7}$/.test(customPronouns);
    const countrySelectID = useId();

    const [hardest, setHardest] = useState<SearchLevelResponse>();
    const hardestSearch = useLevelSearch('profileSettingsHardest', {
        defaultLevel: data?.HardestID,
        onLevel: setHardest,
    });

    const minPrefRef = useRef<HTMLInputElement>(null);
    const maxPrefRef = useRef<HTMLInputElement>(null);

    useEffect(() => {
        if (minPrefRef.current && data.MinPref) minPrefRef.current.value = data.MinPref.toString();
        if (maxPrefRef.current && data.MaxPref) maxPrefRef.current.value = data.MaxPref.toString();
    }, [data]);

    const updateMutation = useMutation({
        mutationFn: saveProfile,
        onSuccess: async () => {
            await refetchUser();
            toast.success('Profile updated successfully!');
        },
        onError: (error: Error) => void toast.error(renderToastError.render({ data: error })),
    });

    function onSave(e: React.FormEvent) {
        e.preventDefault();
        if (!data) return toast.error('No user data available to update.');

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
            introduction: introduction || null,
            pronouns,
            countryCode: countryKey === '-' ? null : countryKey,
            hardest: hardest?.ID ?? null,
            minPref: parseInt(minPrefRef.current.value) || null,
            maxPref: parseInt(maxPrefRef.current.value) || null,
        });
    }

    if (status === 'pending') return <LoadingSpinner />;
    if (status === 'error')
        return (
            <div>
                <Heading1>An error occurred</Heading1>
            </div>
        );

    return (
        <form onSubmit={onSave}>
            <FormGroup>
                <FormInputLabel>Your name</FormInputLabel>
                <TextInput
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    invalid={!name.match(/^[a-zA-Z0-9._]{0,32}$/)}
                />
            </FormGroup>
            <FormGroup className='grid grid-cols-1 md:grid-cols-2 gap-6'>
                <div>
                    <FormInputLabel>Introduction</FormInputLabel>
                    <TextArea
                        spellCheck={false}
                        value={introduction}
                        onChange={(e) => setIntroduction(e.target.value)}
                    />
                    <FormInputDescription>
                        Your introduction is visible to everyone visiting your profile.
                    </FormInputDescription>
                </div>
                <div>
                    <FormInputLabel>Preview</FormInputLabel>
                    <div className='border-b-2 p-2 bg-theme-950/70 min-h-32 max-h-64 overflow-auto scrollbar-thin wrap-break-word'>
                        <Markdown components={markdownComponents}>
                            {introduction || 'No introduction provided.'}
                        </Markdown>
                    </div>
                </div>
            </FormGroup>
            <FormGroup>
                <FormInputLabel>Pronouns</FormInputLabel>
                <Select options={pronounOptions} activeKey={pronounKey} onChange={setPronounKey} id={pronounSelectID} />
                {pronounKey === 'other' && (
                    <div className='mt-3'>
                        <TextInput
                            value={customPronouns}
                            onChange={(e) => setCustomPronouns(e.target.value)}
                            placeholder='Please specify...'
                            invalid={!arePronounsValid}
                        />
                        {!arePronounsValid && (
                            <p className='text-red-500'>
                                Each pronoun must be 1-6 lowercase letters, separated by slashes.
                            </p>
                        )}
                    </div>
                )}
                <FormInputDescription>What are your pronouns?</FormInputDescription>
            </FormGroup>
            <FormGroup>
                <FormInputLabel htmlFor={countrySelectID}>Country</FormInputLabel>
                <Select options={countryOptions} activeKey={countryKey} onChange={setCountryKey} id={countrySelectID} />
                <FormInputDescription>Where are you from?</FormInputDescription>
            </FormGroup>
            <FormGroup>
                <FormInputLabel>Hardest level</FormInputLabel>
                {hardestSearch.SearchBox}
                <FormInputDescription>
                    What is the hardest level you have completed? Does not automatically update!
                </FormInputDescription>
            </FormGroup>
            <FormGroup>
                <FormInputLabel>Tier preference</FormInputLabel>
                <div className='flex gap-2'>
                    <NumberInput ref={minPrefRef} />
                    <p>to</p>
                    <NumberInput ref={maxPrefRef} />
                </div>
            </FormGroup>
            <PrimaryButton type='submit' className='float-right mt-4' loading={updateMutation.isPending}>
                Update
            </PrimaryButton>
        </form>
    );
}
