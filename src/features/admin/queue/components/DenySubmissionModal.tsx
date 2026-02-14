import { useState } from 'react';
import FormGroup from '../../../../components/form/FormGroup';
import FormInputDescription from '../../../../components/form/FormInputDescription';
import FormInputLabel from '../../../../components/form/FormInputLabel';
import { TextInput } from '../../../../components/shared/input/Input';
import Modal from '../../../../components/layout/Modal';
import Select from '../../../../components/shared/input/Select';
import { DangerButton } from '../../../../components/ui/buttons/DangerButton';
import PendingSubmission from '../../../../api/types/PendingSubmission';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import DenySubmission from '../../../../api/submissions/DenySubmission';
import { AxiosError } from 'axios';
import { toast } from 'react-toastify';
import renderToastError from '../../../../utils/renderToastError';
import Checkbox from '../../../../components/input/CheckBox';

const denyReasons = {
    missingProof: 'Missing proof',
    wrongProof: 'Wrong proof',
    inaccessibleProof: 'Inaccessible proof',
    noEndscreen: 'No endscreen',
    incompleteRun: "Doesn't show the entire run",
    missingClicks: 'Missing/incoherent clicks',
    hacked: 'Hacked',
    fakeAccount: 'Fake account',
    custom: 'Other',
};
type DenyReason = keyof typeof denyReasons;

interface Props {
    submission: Pick<PendingSubmission, 'ID' | 'UserID'>;
    onClose: () => void;
}

export default function DenySubmissionModal({ submission, onClose }: Props) {
    const [selectableReason, setSelectableReason] = useState<DenyReason>('custom');
    const [shouldBlacklistProof, setShouldBlacklistProof] = useState(false);
    const [customReason, setCustomReason] = useState('');

    const queryClient = useQueryClient();
    const denyMutation = useMutation({
        mutationFn: (data: { ID: number; reason: string }) =>
            DenySubmission(data.ID, data.reason, shouldBlacklistProof),
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
        denyMutation.mutate({
            ID: submission.ID,
            reason: selectableReason === 'custom' ? customReason : selectableReason,
        });
    }

    return (
        <Modal title='Deny submission?' show={true} onClose={() => onClose()}>
            <form onSubmit={onDeny}>
                <FormGroup>
                    <FormInputLabel htmlFor='denyReason'>Select a type</FormInputLabel>
                    <Select
                        id='denyReason'
                        options={denyReasons}
                        activeKey={selectableReason}
                        onChange={setSelectableReason}
                        height='36'
                    />
                    <FormInputDescription>Choose a reason for denying the submission.</FormInputDescription>
                </FormGroup>
                {selectableReason === 'wrongProof' && (
                    <label className='flex gap-1 items-center'>
                        <Checkbox
                            checked={shouldBlacklistProof}
                            onChange={(e) => setShouldBlacklistProof(e.target.checked)}
                        />
                        Blacklist proof?
                    </label>
                )}
                {['custom', 'hacked'].includes(selectableReason) && (
                    <FormGroup>
                        <FormInputLabel htmlFor='customDenyReason'>Write a reason</FormInputLabel>
                        <TextInput
                            value={customReason}
                            onChange={(e) => setCustomReason(e.target.value.trimStart())}
                            id='customDenyReason'
                            placeholder='Reason...'
                            required
                        />
                    </FormGroup>
                )}
                <div className='mt-8'>
                    <DangerButton className='block w-full py-1' type='submit' loading={denyMutation.isPending}>
                        Deny
                    </DangerButton>
                    <button
                        className='my-2 py-1 block w-full border rounded border-theme-text/35'
                        type='button'
                        onClick={() => onClose()}
                    >
                        Cancel
                    </button>
                </div>
            </form>
        </Modal>
    );
}
