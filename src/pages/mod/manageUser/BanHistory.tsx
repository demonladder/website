import { useMutation } from '@tanstack/react-query';
import BanRecord from './BanRecord';
import InlineLoadingSpinner from '../../../components/InlineLoadingSpinner';
import { UserResponse } from '../../../api/user/GetUser';
import { TextInput } from '../../../components/Input';
import useSelect from '../../../hooks/useSelect';
import { useId, useState } from 'react';
import { toast } from 'react-toastify';
import renderToastError from '../../../utils/renderToastError';
import FormGroup from '../../../components/form/FormGroup';
import FormInputLabel from '../../../components/form/FormInputLabel';
import Heading3 from '../../../components/headings/Heading3';
import { useUserBans } from '../../../hooks/api/user/useUserBans';
import { banUser } from '../../../api/user/bans/banUser';
import { DangerButton } from '../../../components/ui/buttons/DangerButton';
import Heading4 from '../../../components/headings/Heading4';
import ms from 'ms';

export default function BanHistory({ user }: { user: UserResponse }) {
    const banQuery = useUserBans(user.ID);

    const selectID = useId();
    const durationSelect = useSelect({
        ID: selectID,
        options: {
            '1w': '1 week',
            '30d': '1 month',
            '13w': '3 months',
            '26w': '6 months',
            '-': 'Permanent',
        },
    });
    const [reason, setReason] = useState('');

    const banMutation = useMutation({
        mutationFn: () => toast.promise(banUser(user.ID, durationSelect.activeElement !== '-' ? ms(durationSelect.activeElement) : null, reason), {
            pending: 'Banning...',
            success: 'User banned!',
            error: renderToastError,
        }),
        onSuccess: () => {
            void banQuery.refetch();
        },
    });

    function submit(e: React.FormEvent<HTMLFormElement>) {
        e.preventDefault();
        banMutation.mutate();
    }

    return (
        <section className='bg-theme-700 border border-theme-outline p-4 round:rounded-xl'>
            <Heading3>Ban history</Heading3>
            <div>
                {banQuery.data?.map((record) => (
                    <BanRecord record={record} key={record.BanID} />
                ))}
                {banQuery.data?.length === 0 &&
                    <p>Clean record :D</p>
                }
                {!banQuery.data && <InlineLoadingSpinner />}
            </div>
            <div className='mt-8'>
                <form onSubmit={submit}>
                    <Heading4>Create new ban</Heading4>
                    <FormGroup>
                        <FormInputLabel htmlFor={selectID}>Select duration:</FormInputLabel>
                        {durationSelect.Select}
                    </FormGroup>
                    <FormGroup>
                        <FormInputLabel htmlFor='banReason'>Reason:</FormInputLabel>
                        <TextInput id='banReason' placeholder='Ban reason...' value={reason} onChange={(e) => setReason(e.target.value.trimStart())} required />
                    </FormGroup>
                    <DangerButton type='submit' disabled={banMutation.isPending}>Ban</DangerButton>
                </form>
            </div>
        </section>
    );
}
