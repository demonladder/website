import { useState, useRef, useEffect } from 'react';
import LevelSearchBox from '../../../components/LevelSearchBox';
import { Level } from '../../../api/levels';
import { NumberInput, TextInput } from '../../../components/Input';
import Select from '../../../components/Select';
import { PrimaryButton } from '../../../components/Button';
import instance from '../../../api/axios';
import { toast } from 'react-toastify';
import { StorageManager } from '../../../storageManager';
import { AxiosError } from 'axios';
import { useQuery } from '@tanstack/react-query';
import { GetSubmissions, Submission } from '../../../api/submissions';
import PageButtons from '../../../components/PageButtons';

export default function EditSubmission() {
    const [levelResult, setLevelResult] = useState<Level>();
    const [userResult, setUserResult] = useState<Submission>();
    const [page, setPage] = useState<number>(1);
    const ratingRef = useRef<HTMLInputElement>(null);
    const enjoymentRef = useRef<HTMLInputElement>(null);
    const proofRef = useRef<HTMLInputElement>(null);
    const refreshRef = useRef<HTMLInputElement>(null);
    const [device, setDevice] = useState(1);

    const { status, data } = useQuery({
        queryKey: ['submissions', { levelID: levelResult?.LevelID, page }],
        queryFn: () => GetSubmissions({ levelID: levelResult?.LevelID || 0, chunk: 24, page: page }),
    });

    useEffect(() => {
        setPage(1);
        setUserResult(undefined);
    }, [levelResult]);

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
            userID: userResult.UserID,
            rating: parseInt(ratingRef.current.value),
            enjoyment: parseInt(enjoymentRef.current.value),
            refreshRate: refreshRef.current.value,
            device,
            proof: proofRef.current.value,
            isEdit: true,
        }, { params: { csrfToken: StorageManager.getCSRF() }, withCredentials: true }),
        {
            pending: 'Editing',
            success: 'Edited submission',
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

    function submissionClicked(s: Submission) {
        if (ratingRef.current !== null) ratingRef.current.value = ''+s.Rating;
        if (enjoymentRef.current !== null) enjoymentRef.current.value = ''+s.Enjoyment;
        if (refreshRef.current !== null) refreshRef.current.value = ''+s.RefreshRate;
        if (proofRef.current !== null) proofRef.current.value = s.Proof;
        setUserResult(s);
    }

    return (
        <div>
            <h3 className='text-2xl mb-3'>Edit Submission</h3>
            <div className='flex flex-col gap-4'>
                <div>
                    <label htmlFor='addSubmissionSearch'>Level:</label>
                    <LevelSearchBox id='addSubmissionSearch' setResult={setLevelResult} />
                </div>
                <div>
                    <p className='font-bold'>Submission list</p>
                    {status !== 'success' ? 'Loading' :
                        <div>
                            <div className='grid grid-cols-4 gap-2'>
                                {data?.submissions.map((s) => (
                                    <p className={'round:rounded ps-2 py-1 cursor-pointer ' + (s.UserID === userResult?.UserID ? 'bg-gray-400 text-black font-bold' : 'bg-gray-600')} onClick={() => submissionClicked(s)} key={'edit_' + s.UserID + '_' + s.LevelID}>{s.Name}</p>
                                ))}
                                {data.submissions.length === 0 && <p>Select a level first</p>
                                }
                            </div>
                            <PageButtons meta={data} onPageChange={setPage} />
                        </div>
                    }
                </div>
            </div>
            <div className={(data?.submissions.length || 0) === 0 ? 'hidden' : 'flex flex-col gap-4'}>
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
                <div>
                    <PrimaryButton onClick={submit}>Edit</PrimaryButton>
                </div>
            </div>
        </div>
    );
}