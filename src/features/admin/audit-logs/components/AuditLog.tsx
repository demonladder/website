import { useState } from 'react';
import Heading3 from '../../../../components/headings/Heading3';
import { AuditEvents } from '../enums/audit-events.enum';
import { IAuditLog } from '../types/IAuditLog';

interface Props {
    log: IAuditLog;
}

function getEvent(log: IAuditLog) {
    switch (log.event) {
        case AuditEvents.PACK_CREATE:
            return <><b>{log.userID}</b> created pack <b>{log.changes?.find((change) => change.key === 'Name')?.newValue}</b></>
        case AuditEvents.PACK_DELETE:
            return <><b>{log.userID}</b> deleted pack <b>{log.changes?.find((change) => change.key === 'Name')?.oldValue}</b></>
        case AuditEvents.USER_UPDATE:
            return <><b>{log.userID}</b> updated user <b>{log.targetID}</b></>
        default:
            return 'Unknown event';
    }
}

export default function AuditLog({ log }: Props) {
    const [showDetails, setShowDetails] = useState(false);

    return (
        <div className='border border-theme-500 bg-theme-800 p-2 my-2 round:rounded-xl cursor-pointer' onClick={() => setShowDetails((prev) => (log.changes?.length ?? 0) > 0 && !prev)}>
            <div className='flex gap-2'>
                <img className='rounded-full size-14' src={`${import.meta.env.VITE_SERVER_URL}/api/user/${log.userID}/discord-pfp`} alt='' />
                <div>
                    <Heading3>{getEvent(log)}</Heading3>
                    <p className='text-theme-400'>{new Date(log.createdAt.replace(' +00:00', 'Z').replace(' ', 'T')).toLocaleString()}</p>
                </div>
            </div>
            {showDetails &&
                <ul>
                    {log.changes?.map((change) => {
                        if (change.oldValue !== undefined && change.newValue !== undefined) return (<li>Changed {change.key.toLowerCase()} from {change.oldValue} to {change.newValue}</li>);
                        if (change.oldValue !== undefined) return (<li>Removed {change.key.toLowerCase()} of {change.oldValue}</li>);
                        return (<li>Set {change.key.toLowerCase()} to {change.newValue}</li>);
                    })}
                </ul>
            }
        </div>
    );
}
