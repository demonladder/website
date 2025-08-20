import { useState } from 'react';
import FormGroup from '../../../components/form/FormGroup';
import FormInputDescription from '../../../components/form/FormInputDescription';
import FormInputLabel from '../../../components/form/FormInputLabel';
import { TextInput } from '../../../components/Input';
import Modal from '../../../components/Modal';
import Select from '../../../components/Select';
import { DangerButton } from '../../../components/ui/buttons/DangerButton';
import { SecondaryButton } from '../../../components/ui/buttons/SecondaryButton';
import PendingSubmission from '../../../api/types/PendingSubmission';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import DenySubmission from '../../../api/submissions/DenySubmission';
import { AxiosError } from 'axios';
import { toast } from 'react-toastify';
import renderToastError from '../../../utils/renderToastError';

const denyReasons = {
    'missingProof': 'Missing proof',
    'wrongProof': 'Wrong proof',
    'inaccessibleProof': 'Inaccessible proof',
    'noEndscreen': 'No endscreen',
    'incompleteRun': 'Doesn\'t show the entire run',
    'missingClicks': 'Missing/incoherent clicks',
    'hacked': 'Hacked',
    'fakeAccount': 'Fake account',
    'custom': 'Other',
};
type DenyReason = keyof typeof denyReasons;

interface Props {
    submission: Pick<PendingSubmission, 'ID' | 'UserID'>;
    onClose: () => void;
}

export default function DenySubmissionModal({ submission, onClose }: Props) {
    const [denyReason, setDenyReason] = useState<DenyReason>('custom');
    const [reason, setReason] = useState('');

    const queryClient = useQueryClient();
    const denyMutation = useMutation({
        mutationFn: (data: { ID: number, reason: string }) => DenySubmission(data.ID, data.reason),
        onSuccess: () => {
            void queryClient.invalidateQueries({ queryKey: ['user', submission.UserID] });
            void queryClient.invalidateQueries({ queryKey: ['submissionQueue'] });
            toast.success('Submission denied!');
            onClose();
        },
        onError: (err: AxiosError) => void toast.error(renderToastError.render({ data: err })),
    });

    function onDeny(e: React.FormEvent) {
        e.preventDefault();
        denyMutation.mutate({ ID: submission.ID, reason });
    }

    return (
        <Modal title='Deny reason' show={true} onClose={() => onClose()}>
            <form onSubmit={onDeny}>
                <FormGroup>
                    <FormInputLabel htmlFor='denyReason'>Select a type</FormInputLabel>
                    <Select id='denyReason' options={denyReasons} activeKey={denyReason} onChange={setDenyReason} height='36' />
                    <FormInputDescription>Choose a reason for denying the submission.</FormInputDescription>
                </FormGroup>
                {['custom', 'hacked'].includes(denyReason) &&
                    <FormGroup>
                        <FormInputLabel htmlFor='customDenyReason'>Write a reason</FormInputLabel>
                        <TextInput value={reason} onChange={(e) => setReason(e.target.value.trimStart())} id='customDenyReason' placeholder='Reason...' required />
                    </FormGroup>
                }
                <FormGroup>
                    <div className='flex gap-2 justify-end'>
                        <SecondaryButton type='button' onClick={() => onClose()}>Close</SecondaryButton>
                        <DangerButton type='submit' loading={denyMutation.isPending}>Deny</DangerButton>
                    </div>
                </FormGroup>
            </form>
        </Modal>
    );
}
