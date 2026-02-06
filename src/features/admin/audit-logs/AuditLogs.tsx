import { useState } from 'react';
import Divider from '../../../components/divider/Divider';
import Heading2 from '../../../components/headings/Heading2';
import PageButtons from '../../../components/shared/PageButtons';
import { SecondaryButton } from '../../../components/ui/buttons/SecondaryButton';
import AuditLog from './components/AuditLog';
import { useAuditLogs } from './hooks/useAuditLogs';
import Select from '../../../components/input/select/Select';
import { AuditEvents } from './enums/audit-events.enum';

const eventFilterOptions = {
    0: 'All',
    [AuditEvents.PENDING_SUBMISSION_DELETE]: 'Denied submissions',
};

export default function AuditLogs() {
    const [page, setPage] = useState(0);
    const [eventFilter, setEventFilter] = useState<keyof typeof eventFilterOptions>(0);
    const auditLogs = useAuditLogs({ eventType: eventFilter, page });

    return (
        <div>
            <div className='flex justify-between'>
                <Heading2>Audit logs</Heading2>
                <div>
                    <SecondaryButton onClick={() => void auditLogs.refetch()}><i className='bx bx-revision' /> Refresh</SecondaryButton>
                </div>
            </div>
            <Select label={`Filter by: ${eventFilterOptions[eventFilter]}`} options={eventFilterOptions} onOption={setEventFilter} />
            {auditLogs.isSuccess &&
                <>
                    <Divider />
                    <ul>{auditLogs.data.logs.map((log) => (
                        <AuditLog log={log} users={auditLogs.data.users} key={log.ID} />
                    ))}</ul>
                    <PageButtons onPageChange={setPage} page={page} limit={auditLogs.data.limit} total={auditLogs.data.total} />
                </>
            }
        </div>
    );
}
