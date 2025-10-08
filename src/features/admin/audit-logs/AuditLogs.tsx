import Divider from '../../../components/divider/Divider';
import Heading2 from '../../../components/headings/Heading2';
import { SecondaryButton } from '../../../components/ui/buttons/SecondaryButton';
import AuditLog from './components/AuditLog';
import { useAuditLogs } from './hooks/useAuditLogs';

export default function AuditLogs() {
    const auditLogs = useAuditLogs();

    return (
        <div>
            <div className='flex justify-between'>
                <Heading2>Audit logs</Heading2>
                <div>
                    <SecondaryButton onClick={() => void auditLogs.refetch()}><i className='bx bx-revision' /> Refresh</SecondaryButton>
                </div>
            </div>
            {auditLogs.isSuccess &&
                <>
                    <Divider />
                    <ul>{auditLogs.data.map((log) => (
                        <AuditLog log={log} key={log.ID} />
                    ))}</ul>
                </>
            }
        </div>
    );
}
