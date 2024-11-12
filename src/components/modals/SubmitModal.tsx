import React, { useEffect, useState } from 'react';
import Modal from '../Modal';
import Select from '../Select';
import SendSubmission, { SubmittableSubmission } from '../../api/submissions/SendSubmission';
import { NumberInput, TextInput } from '../Input';
import { PrimaryButton, SecondaryButton } from '../Button';
import { toast } from 'react-toastify';
import { FullLevel } from '../../api/types/compounds/FullLevel';
import renderToastError from '../../utils/renderToastError';
import StorageManager from '../../utils/StorageManager';
import { validateIntChange, validateIntInputChange } from '../../utils/validators/validateIntChange';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import WarningBox from '../message/WarningBox';
import { validateLink } from '../../utils/validators/validateLink';
import CheckBox from '../input/CheckBox';
import useUserSearch from '../../hooks/useUserSearch';
import GetSingleSubmission from '../../api/submissions/GetSingleSubmission';
import FormInputLabel from '../form/FormInputLabel';
import FormInputDescription from '../form/FormInputDescription';
import useUser from '../../hooks/useUser';
import DeleteSubmission from '../../api/submissions/DeleteSubmission';

interface Props {
    level: FullLevel;
    userID?: number;
    onClose: () => void;
}

const enjoymentOptions = {
    '-1': '-',
    0: '0 Abysmal',
    1: '1 Appalling',
    2: '2 Horrible',
    3: '3 Bad',
    4: '4 Subpar',
    5: '5 Average',
    6: '6 Fine',
    7: '7 Good',
    8: '8 Great',
    9: '9 Amazing',
    10: '10 Masterpiece',
};

const deviceOptions = {
    1: 'PC',
    2: 'Mobile',
};

const acceptedHosts: string[] = [
    'www.youtube.com',
    'm.youtube.com',
    'youtube.com',
    'youtu.be',
    'www.twitch.tv',
    'twitch.tv',
    'www.bilibili.com',
    'm.bilibili.com',
    'bilibili.com',
    'drive.google.com',
];

const MINIMUM_REFRESH_RATE = parseInt(import.meta.env.VITE_MINIMUM_REFRESH_RATE);

export default function SubmitModal({ onClose, level, userID }: Props) {
    const [tier, setTier] = useState<string>('');
    const [enjoymentKey, setEnjoymentKey] = useState('-1');
    const [deviceKey, setDeviceKey] = useState(StorageManager.getSettings().submission.defaultDevice);
    const [refreshRate, setRefreshRate] = useState(StorageManager.getSettings().submission.defaultRefreshRate.toString());
    const [proof, setProof] = useState('');
    const [progress, setProgress] = useState('');
    const [attempts, setAttempts] = useState('');
    const [wasSolo, setWasSolo] = useState(true);
    const [randomAttempts] = useState(((x) => {
        if (!x) x = Math.random() + 4.5;
        return 15 * x**2 + 200 + (Math.random() * 2 - 1) * x**0.5 * 100;
    })(level.Rating));

    const session = useUser();

    const { data: userSubmission } = useQuery({
        queryKey: ['submission', level.ID, session.user?.ID],
        queryFn: () => GetSingleSubmission(level.ID, session.user?.ID),
        enabled: session.user !== undefined,
    });

    const secondPlayerSearch = useUserSearch({ ID: 'secondPlayerSubmit', maxUsersOnList: 2 });

    useEffect(() => {
        if (userSubmission === undefined) return;

        if (userSubmission.Rating !== null) setTier(userSubmission.Rating.toString());
        if (userSubmission.Enjoyment !== null) setEnjoymentKey(userSubmission.Enjoyment.toString());
        setRefreshRate(userSubmission.RefreshRate.toString());
        setDeviceKey(userSubmission.Device === 'Mobile' ? '2' : '1');
        if (userSubmission.Proof !== null) setProof(userSubmission.Proof.toString());
        setProgress(userSubmission.Progress.toString());
        if (userSubmission.Attempts !== null) setAttempts(userSubmission.Attempts.toString());
        setWasSolo(userSubmission.IsSolo);
        if (userSubmission.SecondaryUser) secondPlayerSearch.setQuery(userSubmission.SecondaryUser.Name);
    }, [userSubmission, secondPlayerSearch]);

    const queryClient = useQueryClient();

    const deleteMutation = useMutation({
        mutationFn: async () => {
            if (session.user?.ID === undefined) return;
            return await toast.promise(DeleteSubmission(level.ID, session.user.ID), {
                pending: 'Deleting...',
                success: 'Submission deleted',
                error: renderToastError,
            });
        },
        onSuccess: () => {
            void queryClient.invalidateQueries(['level', level.ID]);
            void queryClient.invalidateQueries(['submission', level.ID, session.user?.ID]);
            if (session.user?.ID !== undefined) void queryClient.invalidateQueries(['user', session.user.ID]);
            onClose();
        },
    });

    function submitForm(e: React.FormEvent) {
        e.preventDefault();
        e.stopPropagation();

        const rating = validateIntChange(tier);
        const enjoyment = parseInt(enjoymentKey) === -1 ? undefined : parseInt(enjoymentKey);

        if (rating !== undefined) {
            if (rating < 1 || rating > 35) {
                toast.error('Rating must be between 1 and 35!');
                return;
            }

            if (rating >= 21 && !proof) {
                toast.error('Proof is required if you want to rate a level 21 or higher!');
                return;
            }
        } else if (enjoyment === undefined || enjoyment === -1) {
            return toast.error('Rating and enjoyment can\'t both be empty!');
        }

        if (parseInt(refreshRate) < MINIMUM_REFRESH_RATE) {
            return toast.error(`Refresh rate has to be at least ${MINIMUM_REFRESH_RATE}!`);
        }

        if (proof && !validateLink(proof)) {
            return toast.error('Proof link is invalid!');
        }

        if (level.Meta.Difficulty === 'Extreme' && !proof) {
            return toast.error('No proof provided!');
        }

        const attemptCount = parseInt(attempts);
        if (!isNaN(attemptCount) && (attemptCount <= 0 || attemptCount.toString() !== attempts)) {
            return toast.error('Attempt count must be a whole number greater than 0!');
        }

        const data: SubmittableSubmission = {
            levelID: level.ID,
            rating: rating ?? null,
            enjoyment: enjoyment ?? null,
            refreshRate: parseInt(refreshRate),
            device: parseInt(deviceKey),
            proof: proof.length > 0 ? proof : undefined,
            progress: parseInt(progress) || 100,
            attempts: attemptCount,
            isSolo: wasSolo,
            secondPlayerID: secondPlayerSearch.activeUser?.ID,
        };

        void toast.promise(SendSubmission(data).then((data) => {
            if (data?.wasAuto) {
                void queryClient.invalidateQueries(['level', level.ID]);
                void queryClient.invalidateQueries(['submission', level.ID, userID]);
                if (userID !== undefined) void queryClient.invalidateQueries(['user', userID]);
            }

            onClose();
            return data;
        }), {
            pending: 'Submitting...',
            success: {
                render: ({ data }) => data?.wasAuto ? 'Rating accepted' : 'Rating submitted',
            },
            error: renderToastError,
        });
    }

    function onBlur(e: React.FocusEvent<HTMLInputElement>) {
        const newVal = validateIntChange(e.target.value);
        if (newVal === undefined) {
            setRefreshRate(StorageManager.getSettings().submission.defaultRefreshRate.toString());
            return;
        }

        setRefreshRate(newVal.toString());
    }

    function FPSChange(e: React.ChangeEvent<HTMLInputElement>) {
        validateIntInputChange(e, setRefreshRate);
    }

    function ratingChange(e: React.ChangeEvent<HTMLInputElement>) {
        validateIntInputChange(e, setTier);
    }

    function onProofChange(e: React.ChangeEvent<HTMLInputElement>) {
        const newValue = e.target.value.trim();
        if (newValue === '') {
            setProof('');
            return;
        }

        try {
            const url = new URL(newValue);

            if (!acceptedHosts.includes(url.host)) {
                toast.error('Invalid url');
            } else {
                setProof(newValue);
            }
        } catch (err) {
            toast.error('Invalid url');
        }
    }

    const tierEnjoymentInvalid = tier === '' && enjoymentKey === '-1';

    return (
        <Modal title='Submit rating' show={true} onClose={onClose}>
            <Modal.Body>
                <p className='my-3'>Make sure to read our guidelines <a href='/about#guidelines' className='text-blue-500' target='_blank'>here</a></p>
                <div className='flex flex-col gap-3'>
                    {level.Meta.Length === 'Platformer' &&
                        <WarningBox text={'Platformer submissions are currently restricted; your tier rating will be ignored, but you\'re welcome to submit your enjoyment for the time being!'} />
                    }
                    <div>
                        <label htmlFor='submitRating'>Tier</label>
                        <NumberInput id='submitRating' value={tier} onChange={ratingChange} inputMode='numeric' invalid={tierEnjoymentInvalid} />
                        <p className='text-sm text-gray-400'>Must be 1-35</p>
                    </div>
                    <div style={{ height: '52px' }}>
                        <label htmlFor='submitEnjoyment'>Enjoyment</label>
                        <Select id='submitEnjoyment' options={enjoymentOptions} activeKey={enjoymentKey} onChange={setEnjoymentKey} invalid={tierEnjoymentInvalid} zIndex={1030} />
                    </div>
                    <div>
                        <label htmlFor='submitRefreshRate'>FPS</label>
                        <NumberInput id='submitRefreshRate' value={refreshRate} onChange={FPSChange} onBlur={onBlur} invalid={parseInt(refreshRate) < MINIMUM_REFRESH_RATE} />
                        <p className='text-sm text-gray-400'>At least {MINIMUM_REFRESH_RATE}fps</p>
                    </div>
                    <div style={{ height: '52px' }}>
                        <label>Device</label>
                        <Select id='submitDevice' options={deviceOptions} activeKey={deviceKey} onChange={setDeviceKey} />
                    </div>
                    <div>
                        <label htmlFor='submitProof'>Proof <a href='/about#proof' target='_blank'><i className='bx bx-info-circle' /></a></label>
                        {level.Meta.Difficulty !== 'Extreme' && Math.round(level.Rating ?? 16) < 16 &&
                            <p className='text-sm text-yellow-500'>Please be aware that proof is not strictly required for easier levels. By not adding proof you can bypass the queue and skip the waiting time to get this submission added.</p>
                        }
                        <TextInput id='submitProof' value={proof} onChange={onProofChange} invalid={(level.Meta.Difficulty === 'Extreme' && !validateLink(proof)) || (proof !== '' && !validateLink(proof))} />
                        <p className='text-sm text-gray-400'>Proof is required for extreme demons. Clicks must be included if the level is tier 31 or higher.</p>
                    </div>
                    {level.Meta.Length !== 'Platformer' &&
                        <div>
                            <FormInputLabel>Percent</FormInputLabel>
                            <NumberInput value={progress} onChange={(e) => setProgress(e.target.value)} placeholder='100' />
                            <FormInputDescription>Optional, defaults to 100. Will not affect ratings or get sent to the queue if under 100.</FormInputDescription>
                        </div>
                    }
                    <div>
                        <FormInputLabel>Attempts</FormInputLabel>
                        <NumberInput value={attempts} onChange={(e) => setAttempts(e.target.value)} placeholder={randomAttempts.toFixed()} />
                        <FormInputDescription>Optional. How many attempts it took you to beat this level.</FormInputDescription>
                    </div>
                    {level.Meta.IsTwoPlayer &&
                        <div>
                            <label className='flex items-center gap-2 mb-2'>
                                <CheckBox checked={wasSolo} onChange={(e) => setWasSolo(e.target.checked)} />
                                Solo completion
                            </label>
                            {!wasSolo && (
                                <div>
                                    <p>The second player:</p>
                                    {secondPlayerSearch.SearchBox}
                                    <p className='text-sm text-gray-400'>If the person you beat this level with doesn't have an account, leave this blank</p>
                                </div>
                            )}
                        </div>
                    }
                </div>
            </Modal.Body>
            <Modal.Footer>
                <div className='flex justify-between'>
                    <button className='text-red-400 underline-t disabled:text-gray-400' onClick={() => deleteMutation.mutate()} disabled={deleteMutation.status === 'loading'}>delete</button>
                    <div>
                        <SecondaryButton onClick={onClose}>Close</SecondaryButton>
                        <PrimaryButton onClick={submitForm}>Submit</PrimaryButton>
                    </div>
                </div>
            </Modal.Footer>
        </Modal>
    );
}