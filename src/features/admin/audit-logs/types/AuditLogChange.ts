export interface AuditLogChange {
    key: string;
    oldValue?: string | number | boolean | null;
    newValue?: string | number | boolean | null;
}
