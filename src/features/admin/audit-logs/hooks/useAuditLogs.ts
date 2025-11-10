import { useQuery } from '@tanstack/react-query';
import { getAuditLogs } from '../api/getAuditLogs';

export interface GetAuditLogsOptions {
    eventType?: number;
    page?: number;
}

export function useAuditLogs(options?: GetAuditLogsOptions) {
    return useQuery({
        queryKey: ['audit-logs', options],
        queryFn: () => getAuditLogs(options),
    });
}
