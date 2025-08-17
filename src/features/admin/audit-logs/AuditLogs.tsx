import Divider from '../../../components/divider/Divider';
import Heading2 from '../../../components/headings/Heading2';
import TonalButton from '../../../components/input/buttons/tonal/TonalButton';
import AuditLog from './components/AuditLog';
import { useAuditLogs } from './hooks/useAuditLogs';

export default function AuditLogs() {
    const auditLogs = useAuditLogs();

    return (
        <div>
            <div className='flex justify-between'>
                <Heading2>Audit log</Heading2>
                <div>
                    <TonalButton size='sm' icon={<i className='bx bx-revision' />} onClick={() => void auditLogs.refetch()}>Refresh</TonalButton>
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
