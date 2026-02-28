import { useMutation } from '@tanstack/react-query';
import { DangerButton } from '../../../components/ui/buttons/DangerButton';
import { SecondaryButton } from '../../../components/ui/buttons/SecondaryButton';
import APIClient from '../../../api/APIClient';
import { toast } from 'react-toastify';
import { Metrics } from '../../../api';
import ms from 'ms';
import Divider from '../../../components/divider/Divider';
import { BotSettings } from './components/BotSettings';
import StatisticLineChart from './components/StatisticLineChart';

export default function Debugging() {
    function handleError() {
        toast.error('Error occurred');
    }

    const { mutate: fixDeviation, status: fixDeviationStatus } = useMutation({
        mutationFn: async () => APIClient.post('/tests/fixDeviation', {}, { timeout: ms('20m') }).catch(handleError),
    });
    const { mutate: restartServer, status: restartServerStatus } = useMutation({
        mutationFn: async () => APIClient.post('/tests/restartServer', {}).catch(handleError),
    });

    return (
        <div>
            <h3 className='text-2xl'>Debugging</h3>
            <p className='mb-2'>For developer eyes only :P</p>
            <div>
                <div className='mb-2'>
                    <SecondaryButton onClick={() => fixDeviation()} disabled={fixDeviationStatus === 'pending'}>
                        Recalculate level stats
                    </SecondaryButton>
                    <p>Takes like 17 minutes</p>
                </div>
                <div className='mb-2'>
                    <DangerButton onClick={() => restartServer()} disabled={restartServerStatus === 'pending'}>
                        Restart server
                    </DangerButton>
                    <p>Self explanatory</p>
                </div>
            </div>
            <Divider />
            <BotSettings />
            <Divider />
            <h3 className='text-2xl'>Cool graphs</h3>
            <div className='grid grid-cols-2 gap-4'>
                <StatisticLineChart metricName={Metrics.REQUESTS} title='Amount of requests' />
                <StatisticLineChart metricName={Metrics.RESPONSE_TIME} title='Average API response time' />
            </div>
        </div>
    );
}
