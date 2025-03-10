import { useQueryClient } from '@tanstack/react-query';
import { useState } from 'react';
import { RevokeBan } from '../userBans/api';
import { toast } from 'react-toastify';
import renderToastError from '../../../utils/renderToastError';
import UserLink from '../../../components/UserLink';
import { DangerButton } from '../../../components/ui/buttons/DangerButton';
import { SecondaryButton } from '../../../components/ui/buttons/SecondaryButton';
import UserBan from '../../../api/types/UserBan';

interface Props {
    record: UserBan;
}

export default function BanRecord({ record }: Props) {
    const duration = (new Date(record.BanStop).getTime() - new Date(record.BanStart).getTime()) / (1000 * 60 * 60 * 24);
    const isActive = new Date(record.BanStop).getTime() > new Date().getTime();

    const [isLoading, setIsloading] = useState(false);
    const queryClient = useQueryClient();
    function onRevoke() {
        setIsloading(true);

        const promise = RevokeBan(record.BanID).then(() => {
            void queryClient.invalidateQueries(['banHistory']);
        }).finally(() => {
            setIsloading(false);
        });

        void toast.promise(promise, {
            pending: 'Revoking...',
            success: 'Ban revoked!',
            error: renderToastError,
        });
    }

    return (
        <div className='bg-gray-500 mb-3 p-3 round:rounded-lg grid grid-cols-1 xl:grid-cols-3 gap-4'>
            <div>
                <p>Ban from <span className='font-bold'>{record.BanStart}</span> to <span className='font-bold'>{record.BanStop}</span> UTC</p>
                <p>Duration: {duration.toFixed(2)} days</p>
            </div>
            <div>
                <p>User banned by {record.StaffID ? <UserLink userID={record.StaffID} /> : '-'}</p>
                <p>Ban reason: {record.Reason || 'None specified'}</p>
            </div>
            <div>
                <p>Status: {isActive ? 'Active' : 'Inactive'}</p>
                {isActive
                    ? <DangerButton onClick={onRevoke} disabled={isLoading}>Revoke</DangerButton>
                    : <SecondaryButton onClick={onRevoke} disabled={isLoading}>Clear</SecondaryButton>
                }
            </div>
        </div>
    );
}