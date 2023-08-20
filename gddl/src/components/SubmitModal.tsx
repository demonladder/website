import React, { useRef, useState } from 'react';
import Modal from '../components/Modal';
import Select from '../components/Select';
import { SendSubmission, SubmittableSubmission } from '../api/submissions';
import { NumberInput, TextInput } from './Input';
import { PrimaryButton, SecondaryButton } from './Button';
import { toast } from 'react-toastify';
import { FullLevel } from '../api/levels';
import renderToastError from '../utils/renderToastError';

type Props = {
    show: boolean,
    onClose: () => void,
    level: FullLevel,
}

const enjoymentOptions: {[key: string]: string} = {
    '-1': '-',
    0: '0 Abysmal',
    1: '1 Appalling',
    2: '2 Horrible',
    3: '3 Very bad',
    4: '4 Bad',
    5: '5 Average',
    6: '6 Fine',
    7: '7 Good',
    8: '8 Very good',
    9: '9 Great',
    10: '10 Masterpiece',
};

const deviceOptions: {[key: string]: string} = {
    1: 'PC',
    2: 'Mobile',
};

export default function SubmitModal({ show, onClose, level }: Props) {
    const ratingRef = useRef<HTMLInputElement>(null);
    const [enjoymentKey, setEnjoymentKey] = useState('-1');
    const [deviceKey, setDeviceKey] = useState('1');
    const [refreshRate, setRefreshRate] = useState('');
    const [proof, setProof] = useState('');

    function submitForm(e: React.FormEvent) {
        e.preventDefault();
        e.stopPropagation();

        if (!ratingRef.current) return toast.error('An error occurred!');

        const rating = parseInt(ratingRef.current.value);
        const enjoyment = parseInt(enjoymentKey) === -1 ? undefined : parseInt(enjoymentKey);

        if (rating < 1 || rating > 35) {
            toast.error('Rating must be between 1 and 35!');
            return;
        }

        if (isNaN(rating) && (enjoyment === undefined || enjoyment === -1)) {
            return toast.error('Rating and enjoyment can\'t both be empty!');
        }

        if (proof && !proof.match(/(https?:\/\/)?(www\.)?[-a-zA-Z0-9@:%._+~#=]{1,256}\.[a-zA-Z0-9()]{1,6}\b([-a-zA-Z0-9()@:%_+.~#?&//=]*)/)) {
            return toast.error('Proof link is invalid!');
        }

        const data: SubmittableSubmission = {
            levelID: level.LevelID,
            rating,
            enjoyment,
            refreshRate: parseInt(refreshRate.match(/([0-9]*)/)?.[0] || ''),
            device: parseInt(deviceKey),
            proof: proof,
        };
        
        toast.promise(SendSubmission(data), {
            pending: 'Submitting',
            success: 'Rating submitted',
            error: renderToastError,
        });
    }

    return (
        <Modal title='Submit rating' show={show} onClose={onClose}>
            <Modal.Body>
                <div className='flex flex-col gap-3'>
                    <div>
                        <label htmlFor='submitRating'>Rating:</label>
                        <NumberInput id='submitRating' ref={ratingRef} inputMode='numeric' />
                        <p className='text-sm text-gray-400'>Must be 1-35</p>
                    </div>
                    <div style={{height: '52px'}}>
                        <label htmlFor='submitEnjoyment'>Enjoyment:</label>
                        <Select id='submitEnjoyment' options={enjoymentOptions} activeKey={enjoymentKey} onChange={setEnjoymentKey} zIndex={1030} />
                    </div>
                    <div>
                        <label htmlFor='submitRefreshRate'>Refresh rate:</label>
                        <NumberInput id='submitRefreshRate' value={refreshRate} onChange={(e) => setRefreshRate(e.target.value)} />
                    </div>
                    <div style={{height: '52px'}}>
                        <label>Device:</label>
                        <Select id='submitDevice' options={deviceOptions} activeKey={deviceKey} onChange={setDeviceKey} />
                    </div>
                    <div>
                        <label htmlFor='submitProof'>Proof:</label>
                        <TextInput id='submitProof' value={proof} onChange={(e) => setProof(e.target.value)} />
                        <p className='text-sm text-gray-400'>Proof is required for extreme demons. Proof must be a link pointing to a video that includes clicks.</p>
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