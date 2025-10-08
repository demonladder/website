import APIClient from '../../../../api/APIClient';
import { AuditEvents } from '../enums/audit-events.enum';
import { AuditLogChange } from '../types/AuditLogChange';

interface AuditLog {
    ID: number;
    event: AuditEvents;
    userID: number;
    targetID: number | null;
    changes: string | null;
    reason: string | null;
    createdAt: string;

    user: {
        Name: string;
        avatar: string;
    } | null;
}

export async function getAuditLogs() {
    const res = await APIClient.get<AuditLog[]>('/audit-logs');
    return res.data.map((log) => ({
        ...log,
        changes: log.changes ? JSON.parse(log.changes) as AuditLogChange[] : null,
    }));
}
