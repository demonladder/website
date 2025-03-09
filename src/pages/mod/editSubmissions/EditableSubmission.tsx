import { toast } from 'react-toastify';
import Submission from '../../../api/types/Submission';
import APIClient from '../../../api/APIClient';
import { FormEvent, useCallback, useState } from 'react';
import { NaNToNull } from '../../../utils/NaNToNull';
import { render } from '../../../utils/renderToastError';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { AxiosError } from 'axios';
import FormGroup from '../../../components/form/FormGroup';
import FormInputLabel from '../../../components/form/FormInputLabel';
import { NumberInput, TextInput } from '../../../components/Input';
import FormInputDescription from '../../../components/form/FormInputDescription';
import Select from '../../../components/Select';
import CheckBox from '../../../components/input/CheckBox';
import { parseInt } from '../../../utils/parse/parseInt';
import { DangerButton, PrimaryButton } from '../../../components/Button';
import { validateTier } from '../../root/bulkSubmit/validateTier';
import { validateEnjoyment } from '../../root/bulkSubmit/validateEnjoyment';

interface Props {
    submission: Submission;
}

const deviceOptions: { [key: string]: string } = {
    '1': 'PC',
    '2': 'Mobile',
};

export default function EditableSubmission({ submission }: Props) {
    const [rating, setRating] = useState<number | undefined>(submission.Rating ?? undefined);
    const [enjoyment, setEnjoyment] = useState<number>();
    const [proof, setProof] = useState('');
    const [refreshRate, setRefreshRate] = useState<number>();
    const [deviceKey, setDeviceKey] = useState('1');
    const [progress, setProgress] = useState<number>();
    const [attempts, setAttempts] = useState('');
    const [wasSolo, setWasSolo] = useState(true);
    const [deleteReason, setDeleteReason] = useState('');
    const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);

    const queryClient = useQueryClient();

    const invalidRating = rating === undefined || !validateTier(rating);
    const invalidEnjoyment = enjoyment === undefined || !validateEnjoyment(enjoyment);

    const updateMutation = useMutation({
        mutationFn: () => APIClient.patch(`/user/${submission.UserID}/submissions/${submission.LevelID}`, {
            levelID: submission.LevelID,
            userID: submission.UserID,
            rating: rating ?? null,
            enjoyment: enjoyment ?? null,
            refreshRate,
            device: parseInt(deviceKey),
            proof: proof !== '' ? proof : null,
            progress,
            attempts: NaNToNull(parseInt(attempts)),
            isSolo: wasSolo,
            isEdit: true,
        }),
        onSuccess: () => queryClient.invalidateQueries(['level', submission.LevelID]),
        onError: (err: AxiosError) => toast.error(render({ data: err })),
    });

    const deleteMutation = useMutation({
        mutationFn: () => APIClient.delete(`/user/${submission.UserID}/submissions/${submission.LevelID}`, {
            data: { reason: deleteReason },
        }),
        onSuccess: () => queryClient.invalidateQueries(['level', submission.LevelID]),
        onError: (err: AxiosError) => toast.error(render({ data: err })),
    });

    const submit = useCallback((e: FormEvent) => {
        e.preventDefault();

        if (invalidRating && invalidEnjoyment) return toast.error('Either rating or enjoyment is required!');

        updateMutation.mutate();
    }, [invalidRating, invalidEnjoyment, updateMutation]);

    return (
        <form onSubmit={submit}>
            <FormGroup>
                <FormInputLabel htmlFor='addSubmissionTier'>Tier</FormInputLabel>
                <NumberInput id='addSubmissionTier' value={rating} onChange={(e) => setRating(parseInt(e.target.value))} min='1' max='35' invalid={invalidRating && invalidEnjoyment} />
                <FormInputDescription>Optional unless missing enjoyment</FormInputDescription>
            </FormGroup>
            <FormGroup>
                <FormInputLabel htmlFor='addSubmissionEnjoyment'>Enjoyment</FormInputLabel>
                <NumberInput id='addSubmissionEnjoyment' value={enjoyment} onChange={(e) => setEnjoyment(parseInt(e.target.value))} min='0' max='10' invalid={invalidRating && invalidEnjoyment} />
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
            <FormGroup>
                <label className='flex items-center gap-2 mb-2'>
                    <CheckBox checked={wasSolo} onChange={(e) => setWasSolo(e.target.checked)} />
                    Solo completion
                </label>
            </FormGroup>
            <div className='flex gap-2'>
                <PrimaryButton type='submit' onClick={submit} disabled={updateMutation.isLoading}>Edit</PrimaryButton>
                <DangerButton type='button' onClick={() => setShowDeleteConfirm(true)} disabled={deleteMutation.isLoading}>Delete</DangerButton>
            </div>
            {showDeleteConfirm &&
                <div className='mt-4'>
                    <TextInput value={deleteReason} onChange={(e) => setDeleteReason(e.target.value)} placeholder='Delete reason' />
                    <FormInputDescription>Does not notify the user if the field is left blank!</FormInputDescription>
                    <PrimaryButton onClick={() => setShowDeleteConfirm(false)}>Cancel</PrimaryButton>
                    <DangerButton onClick={() => deleteMutation.mutate()}>Confirm delete</DangerButton>
                </div>
            }
        </form>
    );
}
