import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import BanRecord from './BanRecord';
import { BanUser, GetBanHistory } from '../userBans/api';
import InlineLoadingSpinner from '../../../components/InlineLoadingSpinner';
import { UserResponse } from '../../../api/user/GetUser';
import { TextInput } from '../../../components/Input';
import { PrimaryButton } from '../../../components/Button';
import useSelect from '../../../hooks/useSelect';
import { useId, useRef } from 'react';
import { toast } from 'react-toastify';
import renderToastError from '../../../utils/renderToastError';
import FormGroup from '../../../components/form/FormGroup';
import FormInputLabel from '../../../components/form/FormInputLabel';

export default function BanHistory({ user }: { user: UserResponse }) {
    const queryClient = useQueryClient();
    const banQuery = useQuery({
        queryKey: ['banHistory', user.ID],
        queryFn: () => GetBanHistory(user.ID),
    });

    const selectID = useId();
    const durationSelect = useSelect({
        ID: selectID,
        options: {
            1: '1 week',
            4: '1 month',
            13: '3 months',
            26: '6 months',
            10000: 'Permanent',
        },
    });
    const reasonRef = useRef<HTMLInputElement>(null);

    const banMutation = useMutation({
        mutationFn: () => toast.promise(BanUser(user.ID, parseInt(durationSelect.activeElement), reasonRef.current?.value ?? ''), {
            pending: 'Banning...',
            success: 'User banned!',
            error: renderToastError,
        }),
        onSuccess: () => {
            void queryClient.invalidateQueries(['banHistory', user.ID]);
        },
    });

    function submit(e: React.MouseEvent) {
        e.preventDefault();

        if (reasonRef.current === null) {
            return toast.error('An error occurred');
        }

        banMutation.mutate();
    }

    return (
        <>
            <h3 className='text-xl'>Ban history</h3>
            {banQuery.status !== 'loading'
                ? <div>
                    {banQuery.data?.map((record) => (
                        <BanRecord record={record} key={record.BanID} />
                    ))}
                    {banQuery.data?.length === 0 &&
                        <p>Clean record :D</p>
                    }
                    <div className='mt-8'>
                        <form>
                            <h4 className='text-lg'>Create new ban</h4>
                            <FormGroup>
                                <FormInputLabel htmlFor={selectID}>Select duration:</FormInputLabel>
                                {durationSelect.Select}
                            </FormGroup>
                            <FormGroup>
                                <FormInputLabel htmlFor='banReason'>Reason:</FormInputLabel>
                                <TextInput id='banReason' placeholder='Ban reason...' ref={reasonRef} />
                            </FormGroup>
                            <PrimaryButton type='submit' onClick={submit} disabled={banMutation.isLoading}>Submit</PrimaryButton>
                        </form>
                    </div>
                </div>
                : <InlineLoadingSpinner />
            }
        </>
    )
}