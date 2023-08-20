import { useState, useRef } from 'react';
import LevelSearchBox from '../../../components/LevelSearchBox';
import { Level } from '../../../api/levels';
import UserSearchBox from '../../../components/UserSearchBox';
import { User } from '../../../api/users';
import { NumberInput, TextInput } from '../../../components/Input';
import Select from '../../../components/Select';
import { DangerButton, PrimaryButton } from '../../../components/Button';
import instance from '../../../api/axios';
import { toast } from 'react-toastify';
import StorageManager from '../../../utils/storageManager';
import { useQueryClient } from '@tanstack/react-query';
import renderToastError from '../../../utils/renderToastError';

const deviceOptions: {[key: string]: string} = {
    '1': 'PC',
    '2': 'Mobile',
};

export default function AddSubmission() {
    const [key, setKey] = useState(1);
    const [deviceKey, setDeviceKey] = useState('1');

    const [levelResult, setLevelResult] = useState<Level>();
    const [invalidLevel, setInvalidLevel] = useState(false);
    const [userResult, setUserResult] = useState<User|null>();
    const [invalidUser, setInvalidUser] = useState(false);
    const ratingRef = useRef<HTMLInputElement>(null);
    const enjoymentRef = useRef<HTMLInputElement>(null);
    const proofRef = useRef<HTMLInputElement>(null);
    const refreshRef = useRef<HTMLInputElement>(null);

    const queryClient = useQueryClient();

    function submit() {
        setInvalidLevel(false);
        setInvalidUser(false);

        if (ratingRef.current === null || enjoymentRef.current === null || refreshRef.current === null || proofRef.current === null) {
            return toast.error('An error occurred');
        }

        // Validate
        if (!levelResult || !userResult) {
            if (!levelResult) {
                setInvalidLevel(true);
                toast.error('You must select a level!');
            }
            if (!userResult) {
                setInvalidUser(true);
                toast.error('You must select a user!');
            }
            
            return;
        }
        
        if ((levelResult.Difficulty === 'Extreme') && !proofRef.current.value) {
            return toast.error('Proof is required!');
        }
        
        // Send
        toast.promise(
            instance.post('/submit/mod', {
                levelID: levelResult.LevelID,
                userID: userResult.ID,
                rating: parseInt(ratingRef.current.value),
                enjoyment: parseInt(enjoymentRef.current.value),
                refreshRate: parseInt(refreshRef.current.value),
                device: parseInt(deviceKey),
                proof: proofRef.current.value,
            }, { params: { csrfToken: StorageManager.getCSRF() }, withCredentials: true }).then(() => {
                queryClient.invalidateQueries(['submissions']);
                queryClient.invalidateQueries(['level', levelResult.LevelID]);
            }),
            {
                pending: 'Adding',
                success: 'Added submission',
                error: renderToastError,
            }
        );
    }

    function clear() {
        setKey(prev => prev+1);
    }

    return (
        <div key={'addSubmission_' + key}>
            <h3 className='text-2xl mb-3'>Add Submission</h3>
            <div className='flex flex-col gap-4'>
                <div>
                    <label htmlFor='addSubmissionSearch'>Level:</label>
                    <LevelSearchBox id='addSubmissionSearch' setResult={setLevelResult} invalid={invalidLevel} />
                </div>
                <div>
                    <label htmlFor='addSubmissionUserSearch'>User:</label>
                    <UserSearchBox id='addSubmissionUserSearch' setResult={setUserResult} invalid={invalidUser} />
                </div>
                <div>
                    <label htmlFor='addSubmissionTier'>Tier:</label>
                    <NumberInput id='addSubmissionTier' ref={ratingRef} />
                </div>
                <div>
                    <label htmlFor='addSubmissionEnjoyment'>Enjoyment:</label>
                    <NumberInput id='addSubmissionEnjoyment' ref={enjoymentRef} />
                </div>
                <div>
                    <label htmlFor='addSubmissionRefreshRate'>Refresh rate:</label>
                    <NumberInput id='addSubmissionRefreshRate' ref={refreshRef} />
                    <p className='text-sm text-gray-400'>Defaults to 60 if empty</p>
                </div>
                <div>
                    <label>Device:</label>
                    <Select id='submitDeviceMod' options={deviceOptions} activeKey={deviceKey} onChange={setDeviceKey} />
                </div>
                <div>
                    <label htmlFor='addSubmissionProof'>Proof:</label>
                    <TextInput id='addSubmissionProof' ref={proofRef} />
                    <p className='text-sm text-gray-400'>Has to be a link</p>
                </div>
            </div>
            <div className='flex justify-between mt-3'>
                <PrimaryButton onClick={submit}>Add</PrimaryButton>
                <DangerButton onClick={clear}>Clear</DangerButton>
            </div>
        </div>
    );
}