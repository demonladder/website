import React, { useState } from 'react';
import LevelSearchBox from '../components/LevelSearchBox';
import Modal from '../components/Modal';
import Select from '../components/Select';
import { useMutation } from '@tanstack/react-query';
import { SendSubmission, SubmittableSubmission } from '../api/submissions';
import LoadingSpinner from '../components/LoadingSpinner';
import { Level } from '../api/levels';
import { AxiosError } from 'axios';
import { Form } from 'react-bootstrap';
import { NumberInput, TextInput } from './Input';
import { PrimaryButton, SecondaryButton } from './Button';

type Props = {
    show: boolean,
    onClose: () => void,
}

export default function SubmitModal({ show, onClose }: Props) {
    const [result, setResult] = useState<Level>();

    const [rating, setRating] = useState<number>();
    const [enjoyment, setEnjoyment] = useState<number>();
    const [refreshRate, setRefreshRate] = useState('');
    const [device, setDevice] = useState(1);
    const [proof, setProof] = useState('');

    const sendSubmission = useMutation({
        mutationFn: SendSubmission,
        onError: (error: AxiosError) => {
            if (!error.response) return;

            if (error.response.status === 401) {
                return setResponse('Invalid session');
            }
            
            setResponse((error.response.data as any).message);
        }
    });

    function submitForm(e: React.FormEvent) {
        e.preventDefault();
        e.stopPropagation();

        if (!result) {
            setResponse('Select a level!');
            return;
        }

        if (rating && (rating < 1 || rating > 35)) {
            setResponse('Rating must be between 1 and 35!');
            return;
        }

        if (proof && !proof.match(/(https?:\/\/)?(www\.)?[-a-zA-Z0-9@:%._+~#=]{1,256}\.[a-zA-Z0-9()]{1,6}\b([-a-zA-Z0-9()@:%_+.~#?&//=]*)/)) {
            setResponse('Proof link is invalid!');
            return;
        }

        const data: SubmittableSubmission = {
            levelID: result.ID,
            rating: rating,
            enjoyment: enjoyment,
            refreshRate: parseInt(refreshRate.match(/([0-9]*)/)?.[0] || ''),
            device: device,
            proof: proof,
        };
        console.log(data);
        
        sendSubmission.mutate(data);
    }

    const [responseMessage, setResponseMessage] = useState('');
    function setResponse(msg: string) {
        setResponseMessage(msg);
        // setTimeout(() => {
        //     setResponseMessage('');
        // }, 5000);
    }

    return (
        <Modal title='Submit rating' show={show}>
            <Modal.Body>
                <Form noValidate onSubmit={submitForm} className='position-relative d-flex flex-column gap-2'>
                    <div className='mb-3'>
                        <label htmlFor='submitLevelSearch'>Level name:</label>
                        <LevelSearchBox id='submitLevelSearch' setResult={setResult} />
                    </div>
                    <div className='mb-3'>
                        <label htmlFor='submitRating'>Rating:</label>
                        <NumberInput id='submitRating' value={rating} onChange={(e: any) => setRating(e.target.value)} />
                    </div>
                    <div className='mb-3' style={{height: '52px'}}>
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
                    <div className='mb-3'>
                        <label htmlFor='submitRefreshRate'>Refresh rate:</label>
                        <NumberInput id='submitRefreshRate' value={refreshRate} onChange={(e) => setRefreshRate(e.target.value)} />
                    </div>
                    <div className='mb-3' style={{height: '52px'}}>
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
                </Form>
            </Modal.Body>
            <Modal.Footer>
                <div className='flex justify-between'>
                    <span className={'txt-danger'} style={{ opacity: responseMessage === '' ? 0 : 1 }} onClick={() => setResponseMessage('')}>{responseMessage}</span>
                    <div className='flex'>
                        <SecondaryButton onClick={onClose}>Close</SecondaryButton>
                        <PrimaryButton type="submit" onClick={submitForm}>
                            Submit
                        </PrimaryButton>
                        <LoadingSpinner isLoading={sendSubmission.isLoading} />
                    </div>
                </div>
            </Modal.Footer>
        </Modal>
    );
}