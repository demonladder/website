import { useState } from 'react';
import { toast } from 'react-toastify';
import renderToastError from '../../../../utils/renderToastError';
import UserLink from '../../../../components/ui/UserLink';
import { DangerButton } from '../../../../components/ui/buttons/DangerButton';
import UserBan from '../../../../api/types/UserBan';
import { revokeBan } from '../../../../api/user/bans/revokeBan';
import ms from 'ms';
import { parseDate } from '../../../../utils/parse/parseDate';

interface Props {
    record: UserBan;
}

export default function BanRecord({ record }: Props) {
    const duration = record.BanStop ? new Date(record.BanStop).getTime() - new Date(record.BanStart).getTime() : null;
    const isActive = record.BanStop ? new Date(record.BanStop).getTime() > new Date().getTime() : true;

    const [isLoading, setIsLoading] = useState(false);
    function onRevoke() {
        setIsLoading(true);

        const promise = revokeBan(record.UserID)
            .then(() => {
                record.BanStop = new Date().toISOString().replace('T', ' ').replace('Z', ' +00:00');
            })
            .finally(() => {
                setIsLoading(false);
            });

        void toast.promise(promise, {
            pending: 'Revoking...',
            success: 'Ban revoked!',
            error: renderToastError,
        });
    }

    return (
        <div className='bg-theme-500 mb-3 p-3 round:rounded-lg grid shadow-lg grid-cols-1 xl:grid-cols-2 gap-4'>
            <div>
                <p>
                    Banned on <b>{parseDate(record.BanStart).toLocaleString()}</b>
                </p>
                {record.BanStop && (
                    <p>
                        Banned until <b>{parseDate(record.BanStop).toLocaleString()}</b>
                    </p>
                )}
                <p>
                    Duration: <b>{duration ? ms(duration) : 'permanent'}</b>
                </p>
            </div>
            <div>
                <p>User banned by {record.StaffID ? <UserLink userID={record.StaffID} /> : '-'}</p>
                <p>
                    Ban reason: <b>{record.Reason || 'None specified'}</b>
                </p>
                <p>
                    Status: <b>{isActive ? 'Active' : 'Inactive'}</b>
                </p>
                {isActive && (
                    <DangerButton onClick={onRevoke} disabled={isLoading}>
                        Revoke
                    </DangerButton>
                )}
            </div>
        </div>
    );
}
