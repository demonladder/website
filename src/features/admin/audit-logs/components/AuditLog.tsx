import { useState } from 'react';
import { Heading3 } from '../../../../components/headings';
import { AuditEvents } from '../enums/audit-events.enum';
import { IAuditLog } from '../types/IAuditLog';
import { parseDate } from '../../../../utils/parse/parseDate';

interface Props {
    log: IAuditLog;
    users: { ID: number; Name: string; avatar: string }[];
}

function getEvent(log: IAuditLog, users: Props['users']) {
    const user = users.find((u) => u.ID === log.userID);
    const targetUser = users.find((u) => u.ID === log.targetID);

    switch (log.event) {
        case AuditEvents.PENDING_SUBMISSION_DELETE:
            return <><b>{user?.Name ?? log.userID}</b> denied a submission from <b>{targetUser?.Name ?? `<${log.targetID}>`}</b></>;
        case AuditEvents.PACK_CREATE:
            return <><b>{user?.Name ?? log.userID}</b> created pack <b>{log.changes?.find((change) => change.key === 'Name')?.newValue}</b></>;
        case AuditEvents.PACK_DELETE:
            return <><b>{user?.Name ?? log.userID}</b> deleted pack <b>{log.changes?.find((change) => change.key === 'Name')?.oldValue}</b></>;
        case AuditEvents.USER_UPDATE:
            return <><b>{user?.Name ?? log.userID}</b> updated user <b>{targetUser?.Name ?? log.targetID}</b></>;
        case AuditEvents.PASSWORD_RESET_LINK_CREATE:
            return <><b>{user?.Name ?? log.userID}</b> created a password reset link for themselves</>;
        case AuditEvents.USER_ROLE_UPDATE:
            return <><b>{log.userID}</b> updated roles of user <b>{log.targetID}</b></>;
        default:
            return `Unknown event (${log.event})`;
    }
}

export default function AuditLog({ log, users }: Props) {
    const [showDetails, setShowDetails] = useState(false);

    const hasChanges = (log.changes?.length ?? 0) > 0;

    return (
        <div className='border border-theme-500 bg-theme-800 p-2 my-2 round:rounded-xl'>
            <div className={'flex justify-between items-center mb-2' + (hasChanges ? ' cursor-pointer' : '')} onClick={() => setShowDetails((prev) => hasChanges && !prev)}>
                <div className='flex gap-2'>
                    {users.find((user) => user.ID === log.userID)?.avatar
                        ? <img className='rounded-full size-14' src={`https://cdn.gdladder.com/avatars/${users.find((user) => user.ID === log.userID)!.ID}/${users.find((user) => user.ID === log.userID)!.avatar}.png`} alt='Profile picture' />
                        : <i className='bx bxs-user-circle text-6xl' />
                    }
                    <div>
                        <Heading3>{getEvent(log, users)}</Heading3>
                        <p className='text-theme-400'>{parseDate(log.createdAt).toLocaleString()}</p>
                    </div>
                </div>
                {hasChanges && (
                    showDetails
                        ? <i className='bx bx-chevron-up ms-auto self-center text-2xl' />
                        : <i className='bx bx-chevron-down ms-auto self-center text-2xl' />
                )}
            </div>
            {showDetails &&
                <ul>
                    {log.changes?.map((change) => {
                        if (change.oldValue !== undefined && change.newValue !== undefined) return (<li><p>- Removed {change.key.toLowerCase()} of <b>"{change.oldValue}"</b></p> <p>+ Added {change.key.toLowerCase()} as <b>"{change.newValue}"</b></p></li>);
                        if (change.oldValue !== undefined) return (<li>- Removed {change.key.toLowerCase()} of {change.oldValue}</li>);
                        return (<li>+ Set {change.key.toLowerCase()} to <b>"{change.newValue}"</b></li>);
                    })}
                    {log.reason && <li>- With reason: <b>{log.reason}</b></li>}
                </ul>
            }
        </div>
    );
}
