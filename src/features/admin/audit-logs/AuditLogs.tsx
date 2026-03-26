import { useState } from 'react';
import Divider from '../../../components/divider/Divider';
import { Heading2 } from '../../../components/headings';
import PageButtons from '../../../components/shared/PageButtons';
import { SecondaryButton } from '../../../components/ui/buttons';
import AuditLog from './components/AuditLog';
import { useAuditLogs } from './hooks/useAuditLogs';
import Select from '../../../components/input/select/Select';
import { AuditEvents } from './enums/audit-events.enum';
import useUserSearch from '../../../hooks/useUserSearch';
import { TextInput } from '../../../components/shared/input/Input';

const eventFilterOptions: Partial<Record<AuditEvents | 0, string>> = {
    0: 'All',
    [AuditEvents.SUBMISSION_UPDATE]: 'Updated submissions',
    [AuditEvents.PENDING_SUBMISSION_DELETE]: 'Denied submissions',
    [AuditEvents.PACK_CREATE]: 'Created packs',
};

export default function AuditLogs() {
    const [page, setPage] = useState(0);
    const [eventFilter, setEventFilter] = useState<keyof typeof eventFilterOptions>(0);
    const [userId, setUserId] = useState<number>();
    const [targetId, setTargetId] = useState<number>();
    const user = useUserSearch({
        ID: 'auditUserTrigger',
        onUser: (user) => setUserId(user?.ID),
    });

    const auditLogs = useAuditLogs({ eventType: eventFilter, page, userId, targetId });

    return (
        <div>
            <div className='flex justify-between'>
                <Heading2>Audit logs</Heading2>
                <div>
                    <SecondaryButton onClick={() => void auditLogs.refetch()}>
                        <i className='bx bx-revision' /> Refresh
                    </SecondaryButton>
                </div>
            </div>
            <div className='flex flex-wrap gap-4'>
                <div>
                    <p>
                        <b>User</b>
                    </p>
                    {user.SearchBox}
                </div>
                <div>
                    <p>
                        <b>Event</b>
                    </p>
                    <Select
                        label={`Filter by: ${eventFilterOptions[eventFilter]}`}
                        options={eventFilterOptions}
                        onOption={(event) => setEventFilter(parseInt(event))}
                    />
                </div>
                <div>
                    <p>
                        <b>Target ID</b>
                    </p>
                    <TextInput
                        placeholder='Enter target ID...'
                        value={targetId}
                        onChange={(e) => setTargetId(e.target.value ? parseInt(e.target.value) : undefined)}
                    />
                </div>
            </div>
            {auditLogs.isSuccess && (
                <>
                    <Divider />
                    <ul>
                        {auditLogs.data.logs.map((log) => (
                            <AuditLog log={log} users={auditLogs.data.users} key={log.ID} />
                        ))}
                    </ul>
                    <PageButtons
                        onPageChange={setPage}
                        page={page}
                        limit={auditLogs.data.limit}
                        total={auditLogs.data.total}
                    />
                </>
            )}
        </div>
    );
}
