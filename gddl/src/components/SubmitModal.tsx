import React, { useState } from 'react';
import Modal from '../components/Modal';
import Select from '../components/Select';
import { SendSubmission, SubmittableSubmission } from '../api/submissions';
import { NumberInput, TextInput } from './Input';
import { PrimaryButton, SecondaryButton } from './Button';
import { toast } from 'react-toastify';
import { AxiosError } from 'axios';
import { FullLevel } from '../api/levels';

type Props = {
    show: boolean,
    onClose: () => void,
    level: FullLevel,
}

export default function SubmitModal({ show, onClose, level }: Props) {
    const [rating, setRating] = useState<number>();
    const [enjoyment, setEnjoyment] = useState<number>();
    const [refreshRate, setRefreshRate] = useState('');
    const [device, setDevice] = useState(1);
    const [proof, setProof] = useState('');

    function submitForm(e: React.FormEvent) {
        e.preventDefault();
        e.stopPropagation();

        if (rating && (rating < 1 || rating > 35)) {
            toast.error('Rating must be between 1 and 35!');
            return;
        }

        if (rating === undefined && enjoyment === undefined) {
            return toast.error('Rating enjoyment can\'t both be empty!');
        }

        if (proof && !proof.match(/(https?:\/\/)?(www\.)?[-a-zA-Z0-9@:%._+~#=]{1,256}\.[a-zA-Z0-9()]{1,6}\b([-a-zA-Z0-9()@:%_+.~#?&//=]*)/)) {
            return toast.error('Proof link is invalid!');
        }

        const data: SubmittableSubmission = {
            levelID: level.LevelID,
            rating: rating,
            enjoyment: enjoyment,
            refreshRate: parseInt(refreshRate.match(/([0-9]*)/)?.[0] || ''),
            device: device,
            proof: proof,
        };
        
        toast.promise(SendSubmission(data), {
            pending: 'Submitting',
            success: 'Rating submitted',
            error: {
                render({data}) {
                    return ((data as AxiosError).response?.data as any).error || 'An error occurred';
                }
            },
        });
    }

    return (
        <Modal title='Submit rating' show={show} onClose={onClose}>
            <Modal.Body>
                <div className='flex flex-col gap-3'>
                    <div>
                        <label htmlFor='submitRating'>Rating:</label>
                        <NumberInput id='submitRating' value={rating} onChange={(e: any) => setRating(e.target.value)} />
                    </div>
                    <div style={{height: '52px'}}>
                        <label htmlFor='submitEnjoyment'>Enjoyment:</label>
                        <Select id='submitEnjoyment' options={[
                            { key: -1, value: '-' },
                            { key: 0, value: '0 Abysmal' },
                            { key: 1, value: '1 Appalling' },
                            { key: 2, value: '2 Horrible' },
                            { key: 3, value: '3 Very bad' },
                            { key: 4, value: '4 Bad' },
                            { key: 5, value: '5 Average' },
                            { key: 6, value: '6 Fine' },
                            { key: 7, value: '7 Good' },
                            { key: 8, value: '8 Very good' },
                            { key: 9, value: '9 Great' },
                            { key: 10, value: '10 Masterpiece' }
                        ]} onChange={(option) => setEnjoyment(option.key)} zIndex={1030} />
                    </div>
                    <div>
                        <label htmlFor='submitRefreshRate'>Refresh rate:</label>
                        <NumberInput id='submitRefreshRate' value={refreshRate} onChange={(e) => setRefreshRate(e.target.value)} />
                    </div>
                    <div style={{height: '52px'}}>
                        <label>Device:</label>
                        <Select id='submitDevice' options={[
                            { key: 1, value: 'PC' },
                            { key: 2, value: 'Mobile' }
                        ]} onChange={(option) => setDevice(option.key)} />
                    </div>
                    <div>
                        <label htmlFor='submitProof'>Proof:</label>
                        <TextInput id='submitProof' value={proof} onChange={(e) => setProof(e.target.value)} />
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