import { useState } from 'react';
import { NumberInput, TextInput } from '../../../components/Input';
import Select from '../../../components/Select';
import { DangerButton, PrimaryButton } from '../../../components/Button';
import APIClient from '../../../api/APIClient';
import { toast } from 'react-toastify';
import { useQueryClient } from '@tanstack/react-query';
import renderToastError from '../../../utils/renderToastError';
import FloatingLoadingSpinner from '../../../components/FloatingLoadingSpinner';
import useLevelSearch from '../../../hooks/useLevelSearch';
import useUserSearch from '../../../hooks/useUserSearch';
import { Level } from '../../../api/levels';

const deviceOptions = {
    '1': 'PC',
    '2': 'Mobile',
};

export default function AddSubmission() {
    const [key, setKey] = useState(1);
    const [deviceKey, setDeviceKey] = useState('1');
    const [isMutating, setIsMutating] = useState(false);

    const [rating, setRating] = useState<number>();
    const [enjoyment, setEnjoyment] = useState<number>();
    const [proof, setProof] = useState('');
    const [refreshRate, setRefreshRate] = useState<number>(60);

    const queryClient = useQueryClient();

    const { activeLevel, markInvalid: markInvalidLevel, SearchBox, clear: clearActiveLevel } = useLevelSearch({ ID: 'addSubmissionSearch' });
    const userSearch = useUserSearch({
        ID: 'addSubmissionUserSearch',
    });

    function submit() {
        // Validate
        if (!activeLevel || !userSearch.activeUser) {
            if (!activeLevel) {
                markInvalidLevel();
                toast.error('You must select a level!');
            }
            if (!userSearch.activeUser) {
                userSearch.markInvalid();
                toast.error('You must select a user!');
            }

            return;
        }

        // Send
        setIsMutating(true);
        void toast.promise(
            APIClient.post('/submit/mod', {
                levelID: activeLevel.LevelID,
                userID: userSearch.activeUser.ID,
                rating: rating,
                enjoyment: enjoyment,
                refreshRate,
                device: parseInt(deviceKey),
                proof,
            }).then((res): string => {
                void queryClient.invalidateQueries(['submissions']);
                void queryClient.invalidateQueries(['level', activeLevel.LevelID]);

                return res.data as string;
            }).finally(() => setIsMutating(false)),
            {
                pending: 'Sending...',
                success: {
                    render({ data }) {
                        if (data === undefined) {
                            return 'Erm, this is not supposed to appear';
                        }
                        return `${data} for ${activeLevel.Name}!`
                    }
                },
                error: renderToastError,
            }
        );
    }

    function clear() {
        setKey(prev => prev + 1);
        clearActiveLevel();
        userSearch.clear();
    }

    const tierValid = validateTier(rating);
    const enjoymentValid = validateEnjoyment(enjoyment);
    const validOverride = tierValid || enjoymentValid;

    return (
        <div key={`addSubmission_${key}`}>
            <FloatingLoadingSpinner isLoading={isMutating} />
            <h3 className='text-2xl mb-3'>Add Submission</h3>
            <div className='flex flex-col gap-4'>
                <div>
                    <label htmlFor='addSubmissionSearch'>Level:</label>
                    {SearchBox}
                </div>
                <div>
                    <label htmlFor='addSubmissionUserSearch'>User:</label>
                    {userSearch.SearchBox}
                </div>
                <div>
                    <label htmlFor='addSubmissionTier'>Tier:</label>
                    <NumberInput id='addSubmissionTier' value={rating} onChange={(e) => setRating(parseInt(e.target.value))} invalid={!(tierValid || validOverride)} />
                </div>
                <div>
                    <label htmlFor='addSubmissionEnjoyment'>Enjoyment:</label>
                    <NumberInput id='addSubmissionEnjoyment' value={enjoyment} onChange={(e) => setEnjoyment(parseInt(e.target.value))} invalid={!(enjoymentValid || validOverride)} />
                </div>
                <div>
                    <label htmlFor='addSubmissionRefreshRate'>Refresh rate:</label>
                    <NumberInput id='addSubmissionRefreshRate' value={refreshRate} onChange={(e) => setRefreshRate(parseInt(e.target.value))} invalid={!validateRefreshRate(refreshRate)} />
                    <p className='text-sm text-gray-400'>Defaults to 60 if empty</p>
                </div>
                <div>
                    <label>Device:</label>
                    <Select id='submitDeviceMod' options={deviceOptions} activeKey={deviceKey} onChange={setDeviceKey} />
                </div>
                <div>
                    <label htmlFor='addSubmissionProof'>Proof:</label>
                    <TextInput id='addSubmissionProof' value={proof} onChange={(e) => setProof(e.target.value)} invalid={!validateProof(proof, activeLevel)} />
                    <p className='text-sm text-gray-400'>Has to be a link</p>
                </div>
            </div>
            <div className='flex justify-between mt-3'>
                <PrimaryButton onClick={submit} disabled={isMutating}>Add</PrimaryButton>
                <DangerButton onClick={clear}>Clear</DangerButton>
            </div>
        </div>
    );
}

function validateTier(tier?: number) {
    if (tier === undefined) return false;
    return !isNaN(tier) && tier >= 1 && tier <= 35;
}

function validateEnjoyment(enjoyment?: number) {
    if (enjoyment === undefined) return false;
    return !isNaN(enjoyment) && enjoyment >= 0 && enjoyment <= 10;
}

function validateRefreshRate(FPS: number) {
    return FPS >= 30;
}

function validateProof(proof: string, level?: Level) {
    return !(level?.Difficulty === 'Extreme' && proof.length === 0);
}