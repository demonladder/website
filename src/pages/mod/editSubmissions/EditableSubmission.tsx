import { toast } from 'react-toastify';
import Submission from '../../../api/types/Submission';
import APIClient from '../../../api/APIClient';
import { FormEvent, useCallback, useState } from 'react';
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
import { DangerButton } from '../../../components/ui/buttons/DangerButton';
import { PrimaryButton } from '../../../components/ui/buttons/PrimaryButton';
import { validateTier } from '../../../utils/validators/validateTier';
import { validateEnjoyment } from '../../../utils/validators/validateEnjoyment';
import DeleteSubmission from '../../../api/submissions/DeleteSubmission';
import useUserQuery from '../../../hooks/queries/useUserQuery';
import Heading3 from '../../../components/headings/Heading3';
import InlineLoadingSpinner from '../../../components/InlineLoadingSpinner';

interface Props {
    submission: Submission;
}

const deviceOptions: { [key: string]: string } = {
    'pc': 'PC',
    'mobile': 'Mobile',
};
type Device = keyof typeof deviceOptions;

function formatDBDateString(date: string) {
    return date.replace(' +00:00', 'Z').replace(' ', 'T');
}

export default function EditableSubmission({ submission }: Props) {
    const [rating, setRating] = useState<number | undefined>(submission.Rating ?? undefined);
    const [enjoyment, setEnjoyment] = useState<number | undefined>(submission.Enjoyment ?? undefined);
    const [proof, setProof] = useState('');
    const [refreshRate, setRefreshRate] = useState(submission.RefreshRate.toString());
    const [deviceKey, setDeviceKey] = useState<Device>(submission.Device.toLowerCase());
    const [progress, setProgress] = useState(submission.Progress.toString());
    const [attempts, setAttempts] = useState(submission.Attempts?.toString() ?? '');
    const [wasSolo, setWasSolo] = useState(true);
    const [secondPlayerID, setSecondPlayerID] = useState<number>();
    const [deleteReason, setDeleteReason] = useState('');
    const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);

    const approvedBy = useUserQuery(submission.ApprovedBy ?? 0, {
        enabled: submission.ApprovedBy !== null,
    });

    const queryClient = useQueryClient();

    const invalidRating = rating === undefined || !validateTier(rating);
    const invalidEnjoyment = enjoyment === undefined || !validateEnjoyment(enjoyment);

    const updateMutation = useMutation({
        mutationFn: () => APIClient.patch(`/submissions/${submission.ID}`, {
            levelID: submission.LevelID,
            userID: submission.UserID,
            rating: rating ?? null,
            enjoyment: enjoyment ?? null,
            refreshRate: parseInt(refreshRate),
            device: deviceKey,
            proof: proof !== '' ? proof : null,
            progress: parseInt(progress),
            attempts: parseInt(attempts) ?? null,
            isSolo: wasSolo,
            secondPlayerID: wasSolo ? null : secondPlayerID,
            isEdit: true,
        }),
        onSuccess: () => {
            void queryClient.invalidateQueries({ queryKey: ['level', submission.LevelID] });
            toast.success('Submission updated!');
        },
        onError: (err: AxiosError) => void toast.error(render({ data: err })),
    });

    const deleteMutation = useMutation({
        mutationFn: () => DeleteSubmission(submission.ID, deleteReason),
        onSuccess: () => queryClient.invalidateQueries({ queryKey: ['level', submission.LevelID] }),
        onError: (err: AxiosError) => void toast.error(render({ data: err })),
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
                <NumberInput id='addSubmissionRefreshRate' value={refreshRate} onChange={(e) => setRefreshRate(e.target.value)} placeholder='60' min='30' />
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
                <NumberInput value={progress} onChange={(e) => setProgress(e.target.value)} placeholder='100' min='1' max='100' />
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
            {!wasSolo &&
                <FormGroup>
                    <FormInputLabel htmlFor='secondPlayerID'>Second player ID</FormInputLabel>
                    <NumberInput id='secondPlayerID' value={secondPlayerID} onChange={(e) => setSecondPlayerID(parseInt(e.target.value))} min='1' />
                    <FormInputDescription>Optional</FormInputDescription>
                </FormGroup>
            }
            <FormGroup className='flex gap-2'>
                <PrimaryButton type='submit' onClick={submit} disabled={updateMutation.isPending}>Edit</PrimaryButton>
                <DangerButton type='button' onClick={() => setShowDeleteConfirm(true)} disabled={deleteMutation.isPending}>Delete</DangerButton>
            </FormGroup>
            <FormGroup>
                <Heading3>Extra info</Heading3>
                <div className='grid grid-cols-3'>
                    {submission.ApprovedBy !== null && <>
                        <InlineLoadingSpinner isLoading={approvedBy.isPending} />
                        {approvedBy.data &&
                            <div>
                                <FormInputLabel>Approved by</FormInputLabel>
                                <div className='flex gap-2'>
                                    <object data={`https://cdn.discordapp.com/avatars/${approvedBy.data.DiscordData?.ID ?? '-'}/${approvedBy.data.DiscordData?.Avatar ?? '-'}.png`} type='image/png' className='rounded-full size-14'>
                                        <i className='bx bxs-user-circle text-9xl' />
                                    </object>
                                    <p className='text-xl self-center'>{approvedBy.data.Name}</p>
                                </div>
                            </div>
                        }
                    </>}
                    <div>
                        <FormInputLabel>Sent At</FormInputLabel>
                        <p className='text-lg'>{new Date(formatDBDateString(submission.DateAdded)).toUTCString()}</p>
                    </div>
                    <div>
                        <FormInputLabel>Changed At</FormInputLabel>
                        <p className='text-lg'>{new Date(formatDBDateString(submission.DateChanged)).toUTCString()}</p>
                        <FormInputDescription>Last time the submission was edited. If it's the same as Sent At, it means it was auto accepted</FormInputDescription>
                    </div>
                </div>
            </FormGroup>
            {showDeleteConfirm &&
                <div className='mt-4'>
                    <TextInput value={deleteReason} onChange={(e) => setDeleteReason(e.target.value)} placeholder='Delete reason' />
                    <FormInputDescription>Does not notify the user if the field is left blank!</FormInputDescription>
                    <PrimaryButton type='button' onClick={() => setShowDeleteConfirm(false)}>Cancel</PrimaryButton>
                    <DangerButton type='button' onClick={() => deleteMutation.mutate()}>Confirm delete</DangerButton>
                </div>
            }
        </form>
    );
}
