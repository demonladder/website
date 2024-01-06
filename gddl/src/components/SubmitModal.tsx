import React, { useRef, useState } from 'react';
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
import { useQueryClient } from '@tanstack/react-query';
import WarningBox from './message/WarningBox';

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

export default function SubmitModal({ show, onClose, level }: Props) {
    const ratingRef = useRef<HTMLInputElement>(null);
    const [enjoymentKey, setEnjoymentKey] = useState('-1');
    const [deviceKey, setDeviceKey] = useState(StorageManager.getSettings().submission.defaultDevice);
    const [refreshRate, setRefreshRate] = useState(StorageManager.getSettings().submission.defaultRefreshRate.toString());
    const [proof, setProof] = useState('');

    const queryClient = useQueryClient();

    function submitForm(e: React.FormEvent) {
        e.preventDefault();
        e.stopPropagation();

        if (!ratingRef.current) return toast.error('An error occurred!');

        const rating = validateIntChange(ratingRef.current.value);
        const enjoyment = parseInt(enjoymentKey) === -1 ? undefined : parseInt(enjoymentKey);

        if (rating !== undefined) {
            if (rating < 1 || rating > 35) {
                toast.error('Rating must be between 1 and 35!');
                return;
            }
        } else if (enjoyment === undefined || enjoyment === -1) {
            return toast.error('Rating and enjoyment can\'t both be empty!');
        }

        if (parseInt(refreshRate) < 30) {
            return toast.error('Refresh rate has to be at least 30!');
        }

        if (proof && !proof.match(/(https?:\/\/)?(www\.)?[-a-zA-Z0-9@:%._+~#=]{1,256}\.[a-zA-Z0-9()]{1,6}\b([-a-zA-Z0-9()@:%_+.~#?&//=]*)/)) {
            return toast.error('Proof link is invalid!');
        }

        const data: SubmittableSubmission = {
            levelID: level.LevelID,
            rating,
            enjoyment,
            refreshRate: parseInt(refreshRate),
            device: parseInt(deviceKey),
            proof: proof.length > 0 ? proof : undefined,
        };

        toast.promise(SendSubmission(data).then((data) => {
            if (data?.wasAuto) {
                queryClient.invalidateQueries(['level', level.LevelID]);
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

    return (
        <Modal title='Submit rating' show={show} onClose={onClose}>
            <Modal.Body>
                <div className='flex flex-col gap-3'>
                    {level.Length === 'Platformer' &&
                        <WarningBox text={'Platformer submissions are currently restricted; your tier rating will be ignored, but you\'re welcome to submit your enjoyment for the time being!'} />
                    }
                    <div>
                        <label htmlFor='submitRating'>Tier:</label>
                        <NumberInput id='submitRating' ref={ratingRef} inputMode='numeric' />
                        <p className='text-sm text-gray-400'>Must be 1-35</p>
                    </div>
                    <div style={{ height: '52px' }}>
                        <label htmlFor='submitEnjoyment'>Enjoyment:</label>
                        <Select id='submitEnjoyment' options={enjoymentOptions} activeKey={enjoymentKey} onChange={setEnjoymentKey} zIndex={1030} />
                    </div>
                    <div>
                        <label htmlFor='submitRefreshRate'>Refresh rate:</label>
                        <NumberInput id='submitRefreshRate' value={refreshRate} onChange={FPSChange} onBlur={onBlur} />
                        <p className='text-sm text-gray-400'>At least 30fps</p>
                    </div>
                    <div style={{ height: '52px' }}>
                        <label>Device:</label>
                        <Select id='submitDevice' options={deviceOptions} activeKey={deviceKey} onChange={setDeviceKey} />
                    </div>
                    <div>
                        <label htmlFor='submitProof'>Proof:</label>
                        <TextInput id='submitProof' value={proof} onChange={(e) => setProof(e.target.value.trim())} />
                        <p className='text-sm text-gray-400'>Proof is required for extreme demons. Clicks must be included if the level is tier 31 or higher.</p>
                    </div>
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