import { AuditEvents } from '../enums/audit-events.enum';
import { AuditLogChange } from './AuditLogChange';

export interface IAuditLog {
    ID: number;
    event: AuditEvents;
    userID: number;
    targetID: number | null;
    changes: AuditLogChange[] | null;
    reason: string | null;
    createdAt: string;

    user: {
        Name: string;
        avatar: string;
    } | null;
}
