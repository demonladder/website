import { useState, useRef } from 'react';
import LevelSearchBox from '../../../components/LevelSearchBox';
import { Level } from '../../../api/levels';
import UserSearchBox from '../../../components/UserSearchBox';
import { User } from '../../../api/users';
import { NumberInput, TextInput } from '../../../components/Input';
import Select from '../../../components/Select';
import { PrimaryButton } from '../../../components/Button';
import instance from '../../../api/axios';
import { toast } from 'react-toastify';
import { StorageManager } from '../../../storageManager';
import { AxiosError } from 'axios';

export default function AddSubmission() {
    const [levelResult, setLevelResult] = useState<Level>();
    const [userResult, setUserResult] = useState<User>();
    const ratingRef = useRef<HTMLInputElement>(null);
    const enjoymentRef = useRef<HTMLInputElement>(null);
    const proofRef = useRef<HTMLInputElement>(null);
    const refreshRef = useRef<HTMLInputElement>(null);
    const [device, setDevice] = useState(1);

    function submit() {
        // Validate
        if (!levelResult) {
            return toast.error('You must select a level!');
        }
        if (!userResult) {
            return toast.error('You must select a user!');
        }

        if (ratingRef.current === null || enjoymentRef.current === null || refreshRef.current === null || proofRef.current === null) {
            return toast.error('An error occurred');
        }

        // Send
        toast.promise(
        instance.post('/submit/mod', {
            levelID: levelResult.LevelID,
            userID: userResult.ID,
            rating: parseInt(ratingRef.current.value),
            enjoyment: parseInt(enjoymentRef.current.value),
            refreshRate: refreshRef.current.value,
            device,
            proof: proofRef.current.value,
        }, { params: { csrfToken: StorageManager.getCSRF() }, withCredentials: true }),
        {
            pending: 'Adding',
            success: 'Added submission',
            error: {
                render({ data }: { data?: AxiosError|undefined }) {
                    if (data?.response?.status && data.response.status < 500) {
                        return 'Error, check formatting';
                    }
                    return 'An error occurred';
                }
            }
        });
    }

    return (
        <div>
            <h3 className='text-2xl mb-3'>Add Submission</h3>
            <div className='flex flex-col gap-4'>
                <div>
                    <label htmlFor='addSubmissionSearch'>Level:</label>
                    <LevelSearchBox id='addSubmissionSearch' setResult={setLevelResult} />
                </div>
                <div>
                    <label htmlFor='addSubmissionUserSearch'>User:</label>
                    <UserSearchBox id='addSubmissionUserSearch' setResult={setUserResult} />
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
                </div>
                <div>
                    <label>Device:</label>
                    <Select id='submitDeviceMod' options={[
                        { key: 1, value: 'PC' },
                        { key: 2, value: 'Mobile' }
                    ]} onChange={(option) => setDevice(option.key)} />
                </div>
                <div>
                    <label htmlFor='addSubmissionProof'>Proof:</label>
                    <TextInput id='addSubmissionProof' ref={proofRef} />
                </div>
            </div>
            <PrimaryButton onClick={submit}>Add</PrimaryButton>
        </div>
    );
}