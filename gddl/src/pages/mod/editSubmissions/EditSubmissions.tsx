import { useState, useRef, useEffect } from 'react';
import { NumberInput, TextInput } from '../../../components/Input';
import Select from '../../../components/Select';
import { DangerButton, PrimaryButton } from '../../../components/Button';
import APIClient from '../../../api/APIClient';
import { toast } from 'react-toastify';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import { DeleteSubmission, GetSubmissions, Submission } from '../../../api/submissions';
import PageButtons from '../../../components/PageButtons';
import LoadingSpinner from '../../../components/LoadingSpinner';
import useLevelSearch from '../../../hooks/useLevelSearch';
import renderToastError from '../../../utils/renderToastError';
import { validateIntChange } from '../../../utils/validators/validateIntChange';

const deviceOptions: { [key: string]: string } = {
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
        queryKey: ['submissions', { levelID: activeLevel?.ID, page }],
        queryFn: () => GetSubmissions({ levelID: activeLevel?.ID || 0, chunk: 24, page }),
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

        const proof = proofRef.current.value;

        // Send
        setIsMutating(true);
        toast.promise(
            APIClient.post('/submit/mod', {
                levelID: activeLevel.ID,
                userID: userResult.UserID,
                rating: validateIntChange(ratingRef.current.value),
                enjoyment: validateIntChange(enjoymentRef.current.value),
                refreshRate,
                device: parseInt(deviceKey),
                proof: proof !== '' ? proof : undefined,
                isEdit: true,
            }).then(() => queryClient.invalidateQueries(['submissions', { levelID: activeLevel.ID }])).finally(() => setIsMutating(false)),
            {
                pending: 'Editing',
                success: 'Edited submission',
                error: renderToastError,
            }
        );
    }

    function submissionClicked(s: Submission) {
        if (ratingRef.current !== null) ratingRef.current.value = '' + s.Rating;
        if (enjoymentRef.current !== null) enjoymentRef.current.value = '' + s.Enjoyment;
        setRefreshRate(s.RefreshRate);
        if (proofRef.current !== null) proofRef.current.value = s.Proof;
        setUserResult(s);
    }

    function deleteSubmission() {
        if (activeLevel === undefined) {
            return toast.error('You must select a level!');
        }
        if (!userResult) {
            return toast.error('You must select a user!');
        }

        setIsMutating(true);
        const request = DeleteSubmission(activeLevel.ID, userResult.UserID).then(() => {
            queryClient.invalidateQueries(['submissions']);
            queryClient.invalidateQueries(['level', activeLevel.ID]);
        }).finally(() => setIsMutating(false));

        toast.promise(request, {
            pending: 'Deleting',
            success: 'Rating deleted',
            error: 'An error occurred',
        });
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
                            <button className={'flex ps-1 border border-white border-opacity-0 hover:border-opacity-80 transition-colors select-none round:rounded ' + (s.UserID === userResult?.UserID ? 'bg-button-primary-1 font-bold' : 'bg-gray-600')} onClick={() => submissionClicked(s)} key={'edit_' + s.UserID + '_' + s.LevelID}>
                                <p className='grow text-start self-center'>{s.Name}</p>
                                <p className={'w-8 py-1 tier-' + (s.Rating !== null ? Math.round(s.Rating) : 0)}>{s.Rating || '-'}</p>
                                <p className={'w-8 py-1 enj-' + (s.Enjoyment !== null ? Math.round(s.Enjoyment) : -1)}>{s.Enjoyment !== null ? s.Enjoyment : '-'}</p>
                            </button>
                        ))}
                        {data.submissions.length === 0 && <p>Select a level first</p>}
                    </div>
                    <PageButtons meta={data} onPageChange={setPage} />
                </div>
                <div className={(data?.submissions.length) === 0 || userResult === undefined ? 'hidden' : 'flex flex-col gap-4'}>
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
                    </div>
                    <div className='flex gap-2'>
                        <PrimaryButton onClick={submit} disabled={isMutating}>Edit</PrimaryButton>
                        <DangerButton onClick={deleteSubmission} disabled={isMutating}>Delete</DangerButton>
                    </div>
                </div>
            </div>
        </div>
    );
}