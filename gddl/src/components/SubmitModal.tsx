import React, { useEffect, useState } from 'react';
import Modal from '../components/Modal';
import Select from '../components/Select';
import { SendSubmission, SubmittableSubmission } from '../api/submissions';
import { NumberInput, TextInput } from './Input';
import { PrimaryButton, SecondaryButton } from './Button';
import { toast } from 'react-toastify';
import { FullLevel } from '../api/levels';
import renderToastError from '../utils/renderToastError';
import StorageManager from '../utils/StorageManager';
import { validateIntChange, validateIntInputChange } from '../utils/validators/validateIntChange';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import WarningBox from './message/WarningBox';
import { validateLink } from '../utils/validators/validateLink';
import CheckBox from './input/CheckBox';
import useUserSearch from '../hooks/useUserSearch';
import GetSingleSubmission from '../api/submissions/requests/GetSingleSubmission';

type Props = {
    show: boolean,
    onClose: () => void,
    level: FullLevel,
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

export default function SubmitModal({ show, onClose, level }: Props) {
    const [tier, setTier] = useState<string>('');
    const [enjoymentKey, setEnjoymentKey] = useState('-1');
    const [deviceKey, setDeviceKey] = useState(StorageManager.getSettings().submission.defaultDevice);
    const [refreshRate, setRefreshRate] = useState(StorageManager.getSettings().submission.defaultRefreshRate.toString());
    const [proof, setProof] = useState('');
    const [wasSolo, setWasSolo] = useState(true);

    const { data: userSubmission } = useQuery({
        queryKey: ['submission', level.ID, StorageManager.getUser()?.ID],
        queryFn: () => GetSingleSubmission(level.ID, StorageManager.getUser()?.ID),
        enabled: StorageManager.getUser() !== null,
    });

    useEffect(() => {
        if (userSubmission === undefined) return;

        if (userSubmission.Rating !== null) setTier(userSubmission.Rating.toString());
        if (userSubmission.Enjoyment !== null) setEnjoymentKey(userSubmission.Enjoyment.toString());
        if (userSubmission.RefreshRate !== null) setRefreshRate(userSubmission.RefreshRate.toString());
        if (userSubmission.Device !== null) setDeviceKey(userSubmission.Device === 'Mobile' ? '2' : '1');
        if (userSubmission.Proof !== null) setProof(userSubmission.Proof.toString());
        if (userSubmission.IsSolo !== null) setWasSolo(userSubmission.IsSolo === 1);
        if (userSubmission.SecondPlayerName !== null) secondPlayerSearch.setQuery(userSubmission.SecondPlayerName);
    }, [userSubmission]);

    const secondPlayerSearch = useUserSearch({ ID: 'secondPlayerSubmit', maxUsersOnList: 2 });

    const queryClient = useQueryClient();

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

        const data: SubmittableSubmission = {
            levelID: level.ID,
            rating,
            enjoyment,
            refreshRate: parseInt(refreshRate),
            device: parseInt(deviceKey),
            proof: proof.length > 0 ? proof : undefined,
            isSolo: wasSolo,
            secondPlayerID: secondPlayerSearch.activeUser?.ID,
        };

        toast.promise(SendSubmission(data).then((data) => {
            if (data?.wasAuto) {
                queryClient.invalidateQueries(['level', level.ID]);
                queryClient.invalidateQueries(['notifications']);
            }

            onClose();
            return data;
        }), {
            pending: 'Submitting',
            success: {
                render: ({ data }) => data.wasAuto ? 'Rating accepted' : 'Rating submitted',
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
        <Modal title='Submit rating' show={show} onClose={onClose}>
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
                        <TextInput id='submitProof' value={proof} onChange={onProofChange} invalid={(level.Meta.Difficulty === 'Extreme' && !validateLink(proof)) || (proof !== '' && !validateLink(proof))} />
                        <p className='text-sm text-gray-400'>Proof is required for extreme demons. Clicks must be included if the level is tier 31 or higher.</p>
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
                <div className='flex round:gap-1 float-right'>
                    <SecondaryButton onClick={onClose}>Close</SecondaryButton>
                    <PrimaryButton onClick={submitForm}>Submit</PrimaryButton>
                </div>
            </Modal.Footer>
        </Modal>
    );
}