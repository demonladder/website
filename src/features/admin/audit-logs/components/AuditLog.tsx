import { useMemo, useState, type ReactNode } from 'react';
import { Heading3 } from '../../../../components/headings';
import { AuditEvents } from '../enums/audit-events.enum';
import { IAuditLog } from '../types/IAuditLog';
import { parseDate } from '../../../../utils/parse/parseDate';
import type { AuditLogChange } from '../types/AuditLogChange';
import ms from 'ms';
import type Role from '../../../../api/types/Role';
import { permissions } from '../../roles/permissions';

interface Props {
    log: IAuditLog;
    users: { ID: number; Name: string; avatar: string }[];
    roles: Role[];
}

function getUserName(users: Props['users'], userID: number | null) {
    const user = users.find((u) => u.ID === userID);
    return user?.Name ?? userID ?? '-';
}

function getRoleName(roles: Props['roles'], roleID: number | null) {
    const role = roles.find((r) => r.ID === roleID);
    return role?.Name ?? `<${roleID}>`;
}

function toNumber(value: AuditLogChange['oldValue'] | AuditLogChange['newValue']) {
    if (typeof value === 'number') return value;
    if (typeof value === 'string' && value.trim() !== '') {
        const parsed = Number(value);
        if (!Number.isNaN(parsed)) return parsed;
    }
    return null;
}

function formatValue(value: AuditLogChange['oldValue'] | AuditLogChange['newValue']) {
    if (value === undefined) return undefined;
    if (value === null) return 'none';
    if (value === '') return 'empty';
    return String(value);
}

function formatColorValue(value: AuditLogChange['oldValue'] | AuditLogChange['newValue']) {
    const color = toNumber(value);
    if (color === null) return formatValue(value) ?? 'none';
    return `#${color.toString(16).toUpperCase().padStart(6, '0')}`;
}

function getPermissionNames(permissionBitField: number) {
    return permissions
        .filter((permission) => (permissionBitField & permission.Flag) !== 0)
        .map((permission) => permission.Name)
        .sort((a, b) => a.localeCompare(b));
}

function formatRoleIds(value: AuditLogChange['oldValue'] | AuditLogChange['newValue'], roles: Props['roles']) {
    if (value === undefined) return [];
    if (typeof value === 'number') return [getRoleName(roles, value)];
    if (typeof value === 'string') {
        return value
            .split(',')
            .map((part) => part.trim())
            .filter((part) => part !== '')
            .map((part) => getRoleName(roles, Number(part)));
    }
    return [];
}

function getUserFromChange(users: Props['users'], value: AuditLogChange['oldValue'] | AuditLogChange['newValue']) {
    const userID = toNumber(value);
    return {
        id: userID,
        name: getUserName(users, userID),
    };
}

function getPackDisplayName(log: IAuditLog) {
    const nameChange = log.changes?.find((change) => change.key === 'Name');
    return formatValue(nameChange?.newValue) ?? formatValue(nameChange?.oldValue) ?? `<${log.targetID}>`;
}

function getSubmissionDeleteLabel(log: IAuditLog, users: Props['users']) {
    const actor = getUserName(users, log.userID);
    const target = getUserName(users, log.targetID);
    const isStaffDelete = typeof log.reason === 'string' && log.reason.trim() !== '';

    return log.userID === log.targetID && !isStaffDelete ? (
        <>
            <b>{actor}</b> deleted their submission
        </>
    ) : (
        <>
            <b>{actor}</b> deleted <b>{target}</b>'s submission
        </>
    );
}

function getEvent(log: IAuditLog, users: Props['users'], roles: Props['roles']) {
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
        case AuditEvents.PACK_UPDATE:
            return (
                <>
                    <b>{user?.Name ?? log.userID}</b> updated pack <b>{getPackDisplayName(log)}</b>
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
            return log.userID === log.targetID ? (
                <>
                    <b>{user?.Name ?? log.userID}</b> updated their profile
                </>
            ) : (
                <>
                    <b>{user?.Name ?? log.userID}</b> updated user <b>{targetUser?.Name ?? log.targetID}</b>
                </>
            );
        case AuditEvents.USER_DELETE:
            return (
                <>
                    <b>{user?.Name ?? log.userID}</b> deleted user <b>{targetUser?.Name ?? log.targetID}</b>
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
        case AuditEvents.SUBMISSION_BULK_DELETE:
            return (
                <>
                    <b>{user?.Name ?? log.userID}</b> bulk deleted <b>{targetUser?.Name ?? log.targetID}</b>'s
                    submissions
                </>
            );
        case AuditEvents.SUBMISSION_ENJOYMENT_DELETE:
            return (
                <>
                    <b>{user?.Name ?? log.userID}</b> deleted <b>{targetUser?.Name ?? log.targetID}</b>'s submission
                    enjoyment
                </>
            );
        case AuditEvents.SUBMISSION_MERGE:
            return (
                <>
                    <b>{user?.Name ?? log.userID}</b> merged <b>{targetUser?.Name ?? log.targetID}</b>'s submission
                </>
            );
        case AuditEvents.USER_BAN_CREATE:
            return (
                <>
                    <b>{user?.Name ?? log.userID}</b> banned <b>{targetUser?.Name ?? log.targetID}</b>
                </>
            );
        case AuditEvents.USER_BAN_REVOKE:
            return (
                <>
                    <b>{user?.Name ?? log.userID}</b> revoked the ban for <b>{targetUser?.Name ?? log.targetID}</b>
                </>
            );
        case AuditEvents.ROLE_UPDATE:
            return (
                <>
                    <b>{user?.Name ?? log.userID}</b> updated role <b>{getRoleName(roles, log.targetID)}</b>
                </>
            );
        default:
            return `Unknown event (${log.event})`;
    }
}

interface EventTransformer {
    getLabel: (log: IAuditLog, users: Props['users'], roles: Props['roles']) => ReactNode;
    getChanges: (change: IAuditLog['changes'], roles: Props['roles']) => ReactNode[];
}
const eventTransformers: Partial<Record<AuditEvents, EventTransformer>> = {
    [AuditEvents.USER_DELETE]: {
        getLabel: (log, users) => (
            <>
                <b>{getUserName(users, log.userID)}</b> deleted user <b>{getUserName(users, log.targetID)}</b>
            </>
        ),
        getChanges: (changes) => changes?.map(defaultChangeTransformer) ?? [],
    },
    [AuditEvents.SUBMISSION_UPDATE]: {
        getLabel: (log, users) => {
            const user = users.find((u) => u.ID === log.userID);
            const targetUser = users.find((u) => u.ID === log.targetID);
            return (
                <>
                    <b>{user?.Name ?? log.userID}</b> updated <b>{targetUser?.Name ?? log.targetID}</b>'s submission
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
    [AuditEvents.SUBMISSION_DELETE]: {
        getLabel: (log, users) => getSubmissionDeleteLabel(log, users),
        getChanges: (changes) => {
            const transformedChanges: ReactNode[] = [];

            for (const change of changes ?? []) {
                if (change.key === 'LevelID') {
                    transformedChanges.push(
                        <p>
                            Deleted submission for level with ID <b>{change.oldValue}</b>
                        </p>,
                    );
                } else transformedChanges.push(defaultChangeTransformer(change));
            }

            return transformedChanges;
        },
    },
    [AuditEvents.SUBMISSION_BULK_DELETE]: {
        getLabel: (log, users) => {
            const user = users.find((u) => u.ID === log.userID);
            const targetUser = users.find((u) => u.ID === log.targetID);
            return (
                <>
                    <b>{user?.Name ?? log.userID}</b> bulk deleted <b>{targetUser?.Name ?? log.targetID}</b>'s
                    submissions
                </>
            );
        },
        getChanges: () => [],
    },
    [AuditEvents.SUBMISSION_ENJOYMENT_DELETE]: {
        getLabel: (log, users) => {
            const user = users.find((u) => u.ID === log.userID);
            const targetUser = users.find((u) => u.ID === log.targetID);
            return (
                <>
                    <b>{user?.Name ?? log.userID}</b> bulk deleted <b>{targetUser?.Name ?? log.targetID}</b>'s
                    enjoyments
                </>
            );
        },
        getChanges: () => [],
    },
    [AuditEvents.SUBMISSION_MERGE]: {
        getLabel: (log, users) => {
            const user = users.find((u) => u.ID === log.userID);
            const userChange = log.changes?.find((change) => change.key === 'UserID');
            const sourceUser = getUserFromChange(users, userChange?.oldValue);
            const targetUser = getUserFromChange(users, userChange?.newValue ?? log.targetID);
            return (
                <>
                    <b>{user?.Name ?? log.userID}</b> merged <b>{sourceUser.name}</b>'s submissions into{' '}
                    <b>{targetUser.name}</b>
                </>
            );
        },
        getChanges: (changes) => {
            const transformedChanges: ReactNode[] = [];

            for (const change of changes ?? []) {
                if (change.key === 'UserID') {
                    transformedChanges.push(
                        <p>
                            Merged submission from user <b>{formatValue(change.oldValue)}</b> into user{' '}
                            <b>{formatValue(change.newValue)}</b>
                        </p>,
                    );
                } else if (change.key === 'Mode') {
                    transformedChanges.push(
                        <p>
                            Merge mode: <b>{formatValue(change.newValue)}</b>
                        </p>,
                    );
                } else transformedChanges.push(defaultChangeTransformer(change));
            }

            return transformedChanges;
        },
    },
    [AuditEvents.USER_BAN_CREATE]: {
        getLabel: (log, users) => {
            const user = users.find((u) => u.ID === log.userID);
            const targetUser = users.find((u) => u.ID === log.targetID);
            return (
                <>
                    <b>{user?.Name ?? log.userID}</b> banned <b>{targetUser?.Name ?? log.targetID}</b>
                </>
            );
        },
        getChanges: (changes) => {
            const transformedChanges: ReactNode[] = [];

            for (const change of changes ?? []) {
                if (change.key === 'Duration') {
                    const duration = change.newValue ? Number(change.newValue) : null;
                    transformedChanges.push(
                        <p>
                            Duration: <b>{duration ? ms(duration) : 'permanent'}</b>
                        </p>,
                    );
                } else transformedChanges.push(defaultChangeTransformer(change));
            }

            return transformedChanges;
        },
    },
    [AuditEvents.PACK_UPDATE]: {
        getLabel: (log, users) => (
            <>
                <b>{getUserName(users, log.userID)}</b> updated pack <b>{getPackDisplayName(log)}</b>
            </>
        ),
        getChanges: (changes) => changes?.map(defaultChangeTransformer) ?? [],
    },
    [AuditEvents.USER_BAN_REVOKE]: {
        getLabel: (log, users) => {
            const user = users.find((u) => u.ID === log.userID);
            const targetUser = users.find((u) => u.ID === log.targetID);
            return (
                <>
                    <b>{user?.Name ?? log.userID}</b> revoked the ban for <b>{targetUser?.Name ?? log.targetID}</b>
                </>
            );
        },
        getChanges: () => [],
    },
    [AuditEvents.USER_ROLE_UPDATE]: {
        getLabel: (log, users) => (
            <>
                <b>{getUserName(users, log.userID)}</b> updated roles of user <b>{getUserName(users, log.targetID)}</b>
            </>
        ),
        getChanges: (changes, roles) => {
            const transformedChanges: ReactNode[] = [];

            for (const change of changes ?? []) {
                if (change.key === 'RoleIDs') {
                    const addedRoles = formatRoleIds(change.newValue, roles);
                    const removedRoles = formatRoleIds(change.oldValue, roles);

                    if (change.oldValue === undefined && addedRoles.length > 0) {
                        transformedChanges.push(
                            <p>
                                Added role{addedRoles.length === 1 ? '' : 's'}: <b>{addedRoles.join(', ')}</b>
                            </p>,
                        );
                    } else if (change.newValue === undefined && removedRoles.length > 0) {
                        transformedChanges.push(
                            <p>
                                Removed role{removedRoles.length === 1 ? '' : 's'}: <b>{removedRoles.join(', ')}</b>
                            </p>,
                        );
                    } else {
                        transformedChanges.push(
                            <p>
                                Changed roles from <b>{removedRoles.join(', ') || 'none'}</b> to{' '}
                                <b>{addedRoles.join(', ') || 'none'}</b>
                            </p>,
                        );
                    }
                } else transformedChanges.push(defaultChangeTransformer(change));
            }

            return transformedChanges;
        },
    },
    [AuditEvents.ROLE_UPDATE]: {
        getLabel: (log, users, roles) => (
            <>
                <b>{getUserName(users, log.userID)}</b> updated role <b>{getRoleName(roles, log.targetID)}</b>
            </>
        ),
        getChanges: (changes) => {
            const transformedChanges: ReactNode[] = [];

            for (const change of changes ?? []) {
                if (change.key === 'Permissions') {
                    const oldPermissionValue = toNumber(change.oldValue) ?? 0;
                    const newPermissionValue = toNumber(change.newValue) ?? 0;

                    if (oldPermissionValue === newPermissionValue) continue;

                    const oldPermissions = getPermissionNames(oldPermissionValue);
                    const newPermissions = getPermissionNames(newPermissionValue);

                    const addedPermissions = newPermissions.filter(
                        (permission) => !oldPermissions.includes(permission),
                    );
                    const removedPermissions = oldPermissions.filter(
                        (permission) => !newPermissions.includes(permission),
                    );

                    if (addedPermissions.length > 0) {
                        transformedChanges.push(
                            <p>
                                Added permissions: <b>{addedPermissions.join(', ')}</b>
                            </p>,
                        );
                    }
                    if (removedPermissions.length > 0) {
                        transformedChanges.push(
                            <p>
                                Removed permissions: <b>{removedPermissions.join(', ')}</b>
                            </p>,
                        );
                    }
                    if (addedPermissions.length === 0 && removedPermissions.length === 0) {
                        transformedChanges.push(defaultChangeTransformer(change));
                    }
                } else if (change.key === 'Icon') {
                    transformedChanges.push(
                        <p>
                            Changed icon from <b>{formatValue(change.oldValue) ?? 'none'}</b> to{' '}
                            <b>{formatValue(change.newValue) ?? 'none'}</b>
                        </p>,
                    );
                } else if (change.key === 'Color') {
                    transformedChanges.push(
                        <p>
                            Changed color from <b>{formatColorValue(change.oldValue)}</b> to{' '}
                            <b>{formatColorValue(change.newValue)}</b>
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
                Removed {change.key}: <b>{formatValue(change.oldValue)}</b>
            </p>
        );
    if (isAdded)
        return (
            <p>
                Added {change.key} as <b>{formatValue(change.newValue)}</b>
            </p>
        );
    return (
        <p>
            Changed {change.key} from <b>{formatValue(change.oldValue)}</b> to <b>{formatValue(change.newValue)}</b>
        </p>
    );
}

export default function AuditLog({ log, users, roles }: Props) {
    const [showDetails, setShowDetails] = useState(false);
    const transformer = useMemo(
        () =>
            eventTransformers[log.event] ??
            ({
                getLabel: getEvent,
                getChanges: (changes) => changes?.map(defaultChangeTransformer) ?? [],
            } as EventTransformer),
        [log.event],
    );

    const changes = useMemo(() => transformer.getChanges(log.changes, roles), [log.changes, roles, transformer]);
    const hasDetails = changes.length > 0 || !!log.reason;

    return (
        <div className='border border-theme-500 bg-theme-800 p-4 my-2 round:rounded-xl'>
            <div
                className={'flex justify-between items-center mb-2' + (hasDetails ? ' cursor-pointer' : '')}
                onClick={() => setShowDetails((prev) => hasDetails && !prev)}
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
                        <Heading3>{transformer.getLabel(log, users, roles)}</Heading3>
                        <p className='text-theme-400'>{parseDate(log.createdAt).toLocaleString()}</p>
                    </div>
                </div>
                {hasDetails &&
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
                                Reason: <b>{log.reason}</b>
                            </div>
                        </li>
                    )}
                </ul>
            )}
        </div>
    );
}
