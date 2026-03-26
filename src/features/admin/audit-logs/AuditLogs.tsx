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
import { FormInputLabel } from '../../../components/form';

const eventFilterOptions: Partial<Record<AuditEvents | 0, string>> = {
    0: 'All Events',
    [AuditEvents.SUBMISSION_UPDATE]: 'Updated Submissions',
    [AuditEvents.PENDING_SUBMISSION_DELETE]: 'Denied Submissions',
    [AuditEvents.PACK_CREATE]: 'Created Packs',
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
                    <FormInputLabel htmlFor='auditUserTrigger'>
                        <b>Filter by User</b>
                    </FormInputLabel>
                    {user.SearchBox}
                </div>
                <div>
                    <FormInputLabel htmlFor='auditEventFilter'>
                        <b>Filter by Event</b>
                    </FormInputLabel>
                    <Select
                        id='auditEventFilter'
                        label={eventFilterOptions[eventFilter]}
                        options={eventFilterOptions}
                        onOption={(event) => setEventFilter(parseInt(event))}
                    />
                </div>
                <div>
                    <FormInputLabel htmlFor='auditTargetIdFilter'>
                        <b>Filter by Target ID</b>
                    </FormInputLabel>
                    <TextInput
                        id='auditTargetIdFilter'
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
