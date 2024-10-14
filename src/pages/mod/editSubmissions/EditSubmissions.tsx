import { useState, useEffect } from 'react';
import { NumberInput, TextInput } from '../../../components/Input';
import Select from '../../../components/Select';
import { DangerButton, PrimaryButton } from '../../../components/Button';
import APIClient from '../../../api/APIClient';
import { toast } from 'react-toastify';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import PageButtons from '../../../components/PageButtons';
import LoadingSpinner from '../../../components/LoadingSpinner';
import useLevelSearch from '../../../hooks/useLevelSearch';
import renderToastError from '../../../utils/renderToastError';
import Submission from '../../../api/types/Submission';
import GetLevelSubmissions from '../../../api/submissions/GetLevelSubmissions';
import DeleteSubmission from '../../../api/submissions/DeleteSubmission';
import useLateValue from '../../../hooks/useLateValue';
import FormGroup from '../../../components/form/FormGroup';
import FormInputLabel from '../../../components/form/FormInputLabel';
import FormInputDescription from '../../../components/form/FormInputDescription';
import { NaNToNull } from '../../../utils/NaNToNull';

const deviceOptions: { [key: string]: string } = {
    '1': 'PC',
    '2': 'Mobile',
};

export default function EditSubmission() {
    const [deviceKey, setDeviceKey] = useState('1');
    const [isMutating, setIsMutating] = useState(false);
    const [deleteReason, setDeleteReason] = useState('');
    const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);

    const { activeLevel, SearchBox } = useLevelSearch({ ID: 'addSubmissionSearch' });
    const [usernameFilter, lateUsernameFilter, setUsernameFilter] = useLateValue('');

    const [userResult, setUserResult] = useState<Submission>();
    const [page, setPage] = useState<number>(1);
    const [rating, setRating] = useState<number | null>();
    const [enjoyment, setEnjoyment] = useState<number | null>();
    const [proof, setProof] = useState('');
    const [refreshRate, setRefreshRate] = useState<number>();
    const [progress, setProgress] = useState<number>();
    const [attempts, setAttempts] = useState('');

    const queryClient = useQueryClient();

    useEffect(() => {
        setShowDeleteConfirm(false);
    }, [activeLevel?.ID, userResult?.UserID, usernameFilter]);

    const { status, data } = useQuery({
        queryKey: ['level', activeLevel?.ID, 'submissions', { page, username: lateUsernameFilter, progressFilterKey: 'all' }],
        queryFn: () => GetLevelSubmissions({ levelID: activeLevel?.ID || 0, chunk: 24, page, username: lateUsernameFilter, progressFilter: 'all' }),
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

        if (rating === null || enjoyment === null) {
            return toast.error('Either rating or enjoyment is required!');
        }

        // Send
        setIsMutating(true);
        void toast.promise(
            APIClient.patch(`/user/${userResult.UserID}/submissions/${activeLevel.ID}`, {
                levelID: activeLevel.ID,
                userID: userResult.UserID,
                rating: rating || null,
                enjoyment: enjoyment || null,
                refreshRate,
                device: parseInt(deviceKey),
                proof: proof !== '' ? proof : null,
                progress,
                attempts: NaNToNull(parseInt(attempts)),
                isEdit: true,
            }).then(() => queryClient.invalidateQueries(['level', activeLevel.ID])).finally(() => setIsMutating(false)),
            {
                pending: 'Editing',
                success: 'Edited submission',
                error: renderToastError,
            },
        );
    }

    function submissionClicked(s: Submission) {
        setRating(s.Rating);
        setEnjoyment(s.Enjoyment);
        setRefreshRate(s.RefreshRate);
        setProof(s.Proof ?? '');
        setUserResult(s);
        setProgress(s.Progress);
        setAttempts(s.Attempts?.toString() ?? '');
    }

    function deleteSubmission() {
        if (activeLevel === undefined) {
            return toast.error('You must select a level!');
        }
        if (!userResult) {
            return toast.error('You must select a user!');
        }

        setIsMutating(true);
        const request = DeleteSubmission(activeLevel.ID, userResult.UserID, deleteReason).then(() => {
            void queryClient.invalidateQueries(['submissions']);
            void queryClient.invalidateQueries(['level', activeLevel.ID]);
            setUserResult(undefined);
        }).finally(() => setIsMutating(false));

        void toast.promise(request, {
            pending: 'Deleting',
            success: 'Rating deleted',
            error: renderToastError,
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
                    <FormInputLabel htmlFor='addSubmissionSearch'>Level:</FormInputLabel>
                    {SearchBox}
                </div>
                <div>
                    <p className='font-bold'>Submission list</p>
                    <TextInput value={usernameFilter} onChange={(e) => setUsernameFilter(e.target.value)} placeholder='Filter by user name...' />
                    <div className='grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-2'>
                        {data?.submissions.map((s) => (
                            <button className={'flex ps-1 border border-white border-opacity-0 hover:border-opacity-80 transition-colors select-none round:rounded ' + (s.UserID === userResult?.UserID ? 'bg-button-primary-1 font-bold' : 'bg-gray-600')} onClick={() => submissionClicked(s)} key={`edit_${s.UserID}_${s.LevelID}`}>
                                <p className='grow text-start self-center'>{s.User.Name}</p>
                                <p className={`w-8 py-1 tier-${s.Rating !== null ? Math.round(s.Rating) : 0}`}>{s.Rating || '-'}</p>
                                <p className={`w-8 py-1 enj-${s.Enjoyment !== null ? Math.round(s.Enjoyment) : -1}`}>{s.Enjoyment !== null ? s.Enjoyment : '-'}</p>
                            </button>
                        ))}
                        {data === undefined && <p>Select a level first</p>}
                        {data.submissions.length === 0 && <p>No submissions</p>}
                    </div>
                    <PageButtons meta={data} onPageChange={setPage} />
                </div>
                {(data?.submissions.length) !== 0 && userResult !== undefined &&
                    <div>
                        <FormGroup>
                            <FormInputLabel htmlFor='addSubmissionTier'>Tier</FormInputLabel>
                            <NumberInput id='addSubmissionTier' value={rating ?? ''} onChange={(e) => setRating(NaNToNull(parseInt(e.target.value)))} min='1' max='35' />
                            <FormInputDescription>Optional unless missing enjoyment</FormInputDescription>
                        </FormGroup>
                        <FormGroup>
                            <FormInputLabel htmlFor='addSubmissionEnjoyment'>Enjoyment</FormInputLabel>
                            <NumberInput id='addSubmissionEnjoyment' value={enjoyment ?? ''} onChange={(e) => setEnjoyment(NaNToNull(parseInt(e.target.value)))} min='0' max='10' />
                            <FormInputDescription>Optional unless missing tier</FormInputDescription>
                        </FormGroup>
                        <FormGroup>
                            <FormInputLabel htmlFor='addSubmissionRefreshRate'>Refresh rate</FormInputLabel>
                            <NumberInput id='addSubmissionRefreshRate' value={refreshRate} onChange={(e) => setRefreshRate(parseInt(e.target.value))} min='30' />
                            <FormInputDescription>Minimum 30</FormInputDescription>
                        </FormGroup>
                        <FormGroup>
                            <FormInputLabel>Device</FormInputLabel>
                            <Select id='submitDeviceMod' options={deviceOptions} activeKey={deviceKey} onChange={setDeviceKey} />
                        </FormGroup>
                        <FormGroup>
                            <FormInputLabel htmlFor='addSubmissionProof'>Proof</FormInputLabel>
                            <TextInput id='addSubmissionProof' value={proof} onChange={(e) => setProof(e.target.value)} />
                            <FormInputDescription>Optional</FormInputDescription>
                        </FormGroup>
                        <FormGroup>
                            <FormInputLabel>Progress</FormInputLabel>
                            <NumberInput value={progress} onChange={(e) => setProgress(parseInt(e.target.value))} min='1' max='100' />
                        </FormGroup>
                        <FormGroup>
                            <FormInputLabel>Attempts</FormInputLabel>
                            <NumberInput value={attempts} onChange={(e) => setAttempts(e.target.value)} min='1' />
                        </FormGroup>
                        <div className='flex gap-2'>
                            <PrimaryButton onClick={submit} disabled={isMutating}>Edit</PrimaryButton>
                            <DangerButton onClick={() => setShowDeleteConfirm(true)} disabled={isMutating}>Delete</DangerButton>
                        </div>
                        {showDeleteConfirm &&
                            <div className='mt-4'>
                                <TextInput value={deleteReason} onChange={(e) => setDeleteReason(e.target.value)} placeholder='Delete reason' />
                                <PrimaryButton onClick={() => setShowDeleteConfirm(false)}>Cancel</PrimaryButton>
                                <DangerButton onClick={deleteSubmission}>Confirm delete</DangerButton>
                            </div>
                        }
                    </div>
                }
            </div>
        </div>
    );
}