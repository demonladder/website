import { useState } from 'react';
import Select from '../../../components/Select';
import { useQuery } from '@tanstack/react-query';
import GetLogs from '../../../api/siteLogs/GetLogs';
import Log from './Log';
import { TextInput } from '../../../components/Input';
import PageButtons from '../../../components/PageButtons';
import useLateValue from '../../../hooks/useLateValue';

const logTypes = {
    info: 'Info',
    audit: 'Audit',
    verbose: 'Verbose',
    warn: 'Warnings',
    error: 'Errors',
};

const timePeriods = {
    '1h': 'Past hour',
    '3h': 'Past 3 hours',
    '6h': 'Past 6 hours',
    '12h': 'Past 12 hours',
    '1d': 'Past day',
    '7d': 'Past week',
    '30d': 'Past month',
    'all': 'All time',
};

export default function Logs() {
    const [logType, setLogType] = useState('audit');
    const [timePeriod, setTimePeriod] = useState('1h');
    const [message, lateMessage, setMessage] = useLateValue('', 500);
    const [page, latePage, setPage, setPageImmediate] = useLateValue(1, 500);

    const { data } = useQuery({
        queryKey: ['logs', { logType, timePeriod, lateMessage, latePage }],
        queryFn: () => GetLogs(logType, timePeriod, lateMessage, latePage),
    });

    return (
        <div>
            <h3 className='mb-4 text-2xl'>Logs</h3>
            <div className='mb-4'>
                <div className='mb-2'>
                    <p>Type of log</p>
                    <Select options={logTypes} activeKey={logType} id='logTypeSelect' onChange={(key) => { setLogType(key); setPageImmediate(1) }} />
                </div>
                <div className='mb-2'>
                    <p>Time period</p>
                    <Select options={timePeriods} activeKey={timePeriod} id='logTimePeriodSelect' onChange={(key) => { setTimePeriod(key); setPageImmediate(1) }} />
                </div>
                <div className='mb-2'>
                    <p>Filter by message</p>
                    <TextInput value={message} onChange={(e) => setMessage(e.target.value)} />
                </div>
            </div>
            {data !== undefined &&
                <>
                    <div className='flex flex-col gap-2'>
                        <p>{data?.Count} logs found</p>
                        {data?.Logs.filter((log) => message === '' || log.Message.toLowerCase().startsWith(message.toLowerCase())).map((log, i) => (<Log log={log} key={`${logType}_${timePeriod}_${i}`} />))}
                    </div>
                    <PageButtons meta={{ total: data?.Count, page, limit: 50 }} onPageChange={setPage} />
                </>
            }
        </div>
    );
}