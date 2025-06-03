import { useRef, useState } from 'react';
import FormGroup from '../form/FormGroup';
import Modal from '../Modal';
import { DangerButton } from '../ui/buttons/DangerButton';
import { SecondaryButton } from '../ui/buttons/SecondaryButton';
import { reportUser } from '../../api/reports/reportUser';
import TextArea from '../input/TextArea';
import Select from '../Select';
import FormInputLabel from '../form/FormInputLabel';
import useUserQuery from '../../hooks/queries/useUserQuery';
import { Id, toast } from 'react-toastify';
import { useMutation } from '@tanstack/react-query';
import { AxiosError } from 'axios';
import renderToastError from '../../utils/renderToastError';

const reasons = {
    '0': 'Select a reason',
    '1': 'Inappropriate content',
    '2': 'Harassment',
    '3': 'Spam',
    '4': 'Impersonation',
    '5': 'Cheating',
    '6': 'Other',
} as const;
type ReportReason = keyof typeof reasons;

export default function ReportUserModal({ userID, onClose }: { userID: number; onClose: () => void }) {
    const [selectedReason, setSelectedReason] = useState<ReportReason>('0');
    const [description, setDescription] = useState('');
    const { data: user } = useUserQuery(userID);

    const toastID = useRef<Id | null>(null);
    const reportMutation = useMutation({
        mutationFn: ([userID, selectedReason, description]: [number, ReportReason, string]) => reportUser(userID, parseInt(selectedReason), description),
        onMutate: () => toastID.current = toast.loading('Reporting user...'),
        onSuccess: () => toast.update(toastID.current!, { render: 'User reported successfully!', type: 'success', isLoading: false, autoClose: 5000 }),
        onError: (error: AxiosError) => toast.update(toastID.current!, { render: renderToastError.render({ data: error }), type: 'error', isLoading: null, autoClose: null }),
    });

    function handleSubmit(e: React.FormEvent) {
        e.preventDefault();

        if (selectedReason === '0') return toast.error('Please select a reason for reporting this user.');

        reportMutation.mutate([userID, selectedReason, description]);
    }

    return (
        <Modal title={`Report ${user?.Name ?? '-'}`} show={true} onClose={onClose}>
            <form onSubmit={(e) => void handleSubmit(e)}>
                <FormGroup>
                    <FormInputLabel htmlFor='reason'>Reason</FormInputLabel>
                    <Select id='reason' options={reasons} activeKey={selectedReason} onChange={setSelectedReason} invalid={selectedReason === '0'} />
                </FormGroup>
                <FormGroup>
                    <FormInputLabel htmlFor='description'>Description</FormInputLabel>
                    <TextArea
                        id='description'
                        value={description}
                        onChange={(e) => setDescription(e.target.value)}
                        placeholder='Please provide a detailed description of the issue.'
                        minLength={5}
                        required
                        invalid={description.length < 5}
                    />
                </FormGroup>
                <FormGroup className='flex place-content-end gap-2'>
                    <SecondaryButton type='button' onClick={close}>Close</SecondaryButton>
                    <DangerButton type='submit'>Report</DangerButton>
                </FormGroup>
            </form>
        </Modal>
    );
}
