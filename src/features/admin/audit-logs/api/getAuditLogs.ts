import APIClient from '../../../../api/APIClient';
import { AuditEvents } from '../enums/audit-events.enum';
import type { GetAuditLogsOptions } from '../hooks/useAuditLogs';
import { AuditLogChange } from '../types/AuditLogChange';

interface AuditLog {
    ID: number;
    event: AuditEvents;
    userID: number;
    targetID: number | null;
    changes: string | null;
    reason: string | null;
    createdAt: string;
}

export async function getAuditLogs(options?: GetAuditLogsOptions) {
    const res = await APIClient.get<{
        page: number;
        limit: number;
        total: number;
        logs: AuditLog[];
        users: { ID: number; Name: string; avatar: string }[];
    }>('/audit-logs', {
        params: {
            eventType: options?.eventType,
            page: options?.page,
        },
    });

    return {
        page: res.data.page,
        limit: res.data.limit,
        total: res.data.total,
        logs: res.data.logs.map((log) => ({
            ...log,
            changes: log.changes ? (JSON.parse(log.changes) as AuditLogChange[]) : null,
        })),
        users: res.data.users,
    };
}
