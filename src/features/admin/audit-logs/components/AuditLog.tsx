import { useMemo, useState, type ReactNode } from 'react';
import { Heading3 } from '../../../../components/headings';
import { AuditEvents } from '../enums/audit-events.enum';
import { IAuditLog } from '../types/IAuditLog';
import { parseDate } from '../../../../utils/parse/parseDate';
import type { AuditLogChange } from '../types/AuditLogChange';

interface Props {
    log: IAuditLog;
    users: { ID: number; Name: string; avatar: string }[];
}

function getEvent(log: IAuditLog, users: Props['users']) {
    const user = users.find((u) => u.ID === log.userID);
    const targetUser = users.find((u) => u.ID === log.targetID);

    switch (log.event) {
        case AuditEvents.PENDING_SUBMISSION_DELETE:
            return (
                <>
                    <b>{user?.Name ?? log.userID}</b> denied a submission from{' '}
                    <b>{targetUser?.Name ?? `<${log.targetID}>`}</b>
                </>
            );
        case AuditEvents.PACK_CREATE:
            return (
                <>
                    <b>{user?.Name ?? log.userID}</b> created pack{' '}
                    <b>{log.changes?.find((change) => change.key === 'Name')?.newValue}</b>
                </>
            );
        case AuditEvents.PACK_DELETE:
            return (
                <>
                    <b>{user?.Name ?? log.userID}</b> deleted pack{' '}
                    <b>{log.changes?.find((change) => change.key === 'Name')?.oldValue}</b>
                </>
            );
        case AuditEvents.USER_UPDATE:
            return (
                <>
                    <b>{user?.Name ?? log.userID}</b> updated user <b>{targetUser?.Name ?? log.targetID}</b>
                </>
            );
        case AuditEvents.PASSWORD_RESET_LINK_CREATE:
            return (
                <>
                    <b>{user?.Name ?? log.userID}</b> created a password reset link for themselves
                </>
            );
        case AuditEvents.USER_ROLE_UPDATE:
            return (
                <>
                    <b>{user?.Name ?? log.userID}</b> updated roles of user <b>{targetUser?.Name ?? log.targetID}</b>
                </>
            );
        case AuditEvents.SUBMISSION_UPDATE:
            return (
                <>
                    <b>{user?.Name ?? log.userID}</b> updated <b>{targetUser?.Name ?? log.targetID}</b>s submission
                </>
            );
        default:
            return `Unknown event (${log.event})`;
    }
}

interface EventTransformer {
    getLabel: (log: IAuditLog, users: Props['users']) => ReactNode;
    getChanges: (change: IAuditLog['changes']) => ReactNode[];
}
const eventTransformers: Partial<Record<AuditEvents, EventTransformer>> = {
    [AuditEvents.SUBMISSION_UPDATE]: {
        getLabel: (log, users) => {
            const user = users.find((u) => u.ID === log.userID);
            const targetUser = users.find((u) => u.ID === log.targetID);
            return (
                <>
                    <b>{user?.Name ?? log.userID}</b> updated <b>{targetUser?.Name ?? log.targetID}</b>s submission
                </>
            );
        },
        getChanges: (changes) => {
            const transformedChanges: ReactNode[] = [];

            for (const change of changes ?? []) {
                if (change.key === 'LevelID') {
                    transformedChanges.push(
                        <p>
                            Updated submission for level with ID <b>{change.oldValue}</b>
                        </p>,
                    );
                } else transformedChanges.push(defaultChangeTransformer(change));
            }

            return transformedChanges;
        },
    },
};

function defaultChangeTransformer(change: AuditLogChange) {
    const isAdded = change.oldValue === undefined;
    const isDeleted = change.newValue === undefined;

    if (isDeleted)
        return (
            <p>
                Removed {change.key}: <b>{change.oldValue}</b>
            </p>
        );
    if (isAdded)
        return (
            <p>
                Added {change.key} as <b>{change.newValue}</b>
            </p>
        );
    return (
        <p>
            Changed {change.key} from <b>{change.oldValue}</b> to <b>{change.newValue}</b>
        </p>
    );
}

export default function AuditLog({ log, users }: Props) {
    const [showDetails, setShowDetails] = useState(false);

    const hasChanges = (log.changes?.length ?? 0) > 0;
    const transformer = useMemo(
        () =>
            eventTransformers[log.event] ??
            ({
                getLabel: getEvent,
                getChanges: (changes) => changes?.map(defaultChangeTransformer) ?? [],
            } as EventTransformer),
        [log.event],
    );

    const changes = useMemo(() => transformer.getChanges(log.changes), [log.changes, transformer]);

    return (
        <div className='border border-theme-500 bg-theme-800 p-4 my-2 round:rounded-xl'>
            <div
                className={'flex justify-between items-center mb-2' + (hasChanges ? ' cursor-pointer' : '')}
                onClick={() => setShowDetails((prev) => hasChanges && !prev)}
            >
                <div className='flex gap-2'>
                    {users.find((user) => user.ID === log.userID)?.avatar ? (
                        <img
                            className='rounded-full size-14'
                            src={`https://cdn.gdladder.com/avatars/${users.find((user) => user.ID === log.userID)!.ID}/${users.find((user) => user.ID === log.userID)!.avatar}.png`}
                            alt='Profile picture'
                        />
                    ) : (
                        <i className='bx bxs-user-circle text-6xl' />
                    )}
                    <div>
                        <Heading3>{transformer.getLabel(log, users)}</Heading3>
                        <p className='text-theme-400'>{parseDate(log.createdAt).toLocaleString()}</p>
                    </div>
                </div>
                {hasChanges &&
                    (showDetails ? (
                        <i className='bx bx-chevron-up ms-auto self-center text-2xl' />
                    ) : (
                        <i className='bx bx-chevron-down ms-auto self-center text-2xl' />
                    ))}
            </div>
            {showDetails && (changes.length > 0 || log.reason) && (
                <ul>
                    {changes.map((change, i) => (
                        <li className='flex' key={i}>
                            <span className='text-theme-primary'>
                                <code>
                                    {(i + 1).toString().padStart(2, '0')}
                                    <span className='mx-2'>-</span>
                                </code>
                            </span>
                            <div>{change}</div>
                        </li>
                    ))}
                    {log.reason && (
                        <li className='flex'>
                            <span className='text-theme-primary'>
                                <code>
                                    {(changes.length + 1).toString().padStart(2, '0')}
                                    <span className='mx-2'>-</span>
                                </code>
                            </span>
                            <div>
                                With reason: <b>{log.reason}</b>
                            </div>
                        </li>
                    )}
                </ul>
            )}
        </div>
    );
}
