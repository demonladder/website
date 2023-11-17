import { useState, useRef, useEffect } from 'react';
import { NumberInput, TextInput } from '../../../components/Input';
import Select from '../../../components/Select';
import { PrimaryButton } from '../../../components/Button';
import APIClient from '../../../api/APIClient';
import { toast } from 'react-toastify';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import { GetSubmissions, Submission } from '../../../api/submissions';
import PageButtons from '../../../components/PageButtons';
import LoadingSpinner from '../../../components/LoadingSpinner';
import useLevelSearch from '../../../hooks/useLevelSearch';
import renderToastError from '../../../utils/renderToastError';

const deviceOptions: {[key: string]: string} = {
    '1': 'PC',
    '2': 'Mobile',
};

export default function EditSubmission() {
    const [deviceKey, setDeviceKey] = useState('1');
    const [isMutating, setIsMutating] = useState(false);

    const { activeLevel, SearchBox } = useLevelSearch({ ID: 'addSubmissionSearch' });

    const [userResult, setUserResult] = useState<Submission>();
    const [page, setPage] = useState<number>(1);
    const ratingRef = useRef<HTMLInputElement>(null);
    const enjoymentRef = useRef<HTMLInputElement>(null);
    const proofRef = useRef<HTMLInputElement>(null);
    const [refreshRate, setRefreshRate] = useState<number>();

    const queryClient = useQueryClient();

    const { status, data } = useQuery({
        queryKey: ['submissions', { levelID: activeLevel?.LevelID, page }],
        queryFn: () => GetSubmissions({ levelID: activeLevel?.LevelID || 0, chunk: 24, page: page }),
    });

    useEffect(() => {
        setPage(1);
        setUserResult(undefined);
    }, [activeLevel]);

    function submit() {
        // Validate
        if (!activeLevel) {
            return toast.error('You must select a level!');
        }
        if (!userResult) {
            return toast.error('You must select a user!');
        }

        if (ratingRef.current === null || enjoymentRef.current === null || proofRef.current === null) {
            return toast.error('An error occurred');
        }

        // Send
        setIsMutating(true);
        toast.promise(
        APIClient.post('/submit/mod', {
            levelID: activeLevel.LevelID,
            userID: userResult.UserID,
            rating: parseInt(ratingRef.current.value),
            enjoyment: parseInt(enjoymentRef.current.value),
            refreshRate,
            device: parseInt(deviceKey),
            proof: proofRef.current.value,
            isEdit: true,
        }).then(() => queryClient.invalidateQueries(['submissions', { levelID: activeLevel.LevelID }])).finally(() => setIsMutating(false)),
        {
            pending: 'Editing',
            success: 'Edited submission',
            error: renderToastError,
        });
    }

    function submissionClicked(s: Submission) {
        if (ratingRef.current !== null) ratingRef.current.value = ''+s.Rating;
        if (enjoymentRef.current !== null) enjoymentRef.current.value = ''+s.Enjoyment;
        setRefreshRate(s.RefreshRate);
        if (proofRef.current !== null) proofRef.current.value = s.Proof;
        setUserResult(s);
    }

    if (status === 'loading') {
        return (<LoadingSpinner />);
    } else if (status === 'error') {
        return 'An error occurred';
    }

    return (
        <div>
            <h3 className='text-2xl mb-3'>Edit Submission</h3>
            <div className='flex flex-col gap-4'>
                <div>
                    <label htmlFor='addSubmissionSearch'>Level:</label>
                    {SearchBox}
                </div>
                <div>
                    <p className='font-bold'>Submission list</p>
                    <div className='grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-2'>
                        {data?.submissions.map((s) => (
                            <p className={'round:rounded select-none border border-white border-opacity-0 hover:border-opacity-80 transition-colors ps-2 py-1 cursor-pointer ' + (s.UserID === userResult?.UserID ? 'bg-button-primary-1 font-bold' : 'bg-gray-600')} onClick={() => submissionClicked(s)} key={'edit_' + s.UserID + '_' + s.LevelID}>{s.Name}</p>
                        ))}
                        {data.submissions.length === 0 && <p>Select a level first</p>}
                    </div>
                    <PageButtons meta={data} onPageChange={setPage} />
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
                        <NumberInput id='addSubmissionRefreshRate' value={refreshRate} onChange={(e) => setRefreshRate(parseInt(e.target.value))} />
                    </div>
                    <div>
                        <label>Device:</label>
                    <Select id='submitDeviceMod' options={deviceOptions} activeKey={deviceKey} onChange={setDeviceKey} />
                    </div>
                    <div>
                        <label htmlFor='addSubmissionProof'>Proof:</label>
                        <TextInput id='addSubmissionProof' ref={proofRef} />
                        <PrimaryButton onClick={submit} disabled={isMutating}>Edit</PrimaryButton>
                    </div>
                </div>
            </div>
        </div>
    );
}