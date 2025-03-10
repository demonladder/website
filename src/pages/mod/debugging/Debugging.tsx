import { useMutation } from '@tanstack/react-query';
import { DangerButton } from '../../../components/ui/buttons/DangerButton';
import { SecondaryButton } from '../../../components/ui/buttons/SecondaryButton';
import APIClient from '../../../api/APIClient';
import { toast } from 'react-toastify';
import { BotSettings } from './BotSettings';
import StatisticLineChart from './StatisticLineChart';
import { Metrics } from '../../../api/stats/GetStatistic';
import ms from 'ms';

export default function Debugging() {
    function handleError() {
        toast.error('Error occurred');
    }

    const { mutate: syncLevels, status: syncLevelsStatus } = useMutation(async () => APIClient.post('/tests/syncLevels').catch(handleError));
    const { mutate: syncTwoPlayerLevels, status: syncTwoPlayerLevelsStatus } = useMutation(async () => APIClient.post('/tests/syncTwoPlayerLevels').catch(handleError));
    const { mutate: fixDeviation, status: fixDeviationStatus } = useMutation(async () => APIClient.post('/tests/fixDeviation', {}, { timeout: ms('20m') }).catch(handleError));
    const { mutate: restartServer, status: restartServerStatus } = useMutation(async () => APIClient.post('/tests/restartServer', {}).catch(handleError));

    return (
        <div>
            <h3 className='text-2xl'>Debugging</h3>
            <p className='mb-2'>For developer eyes only :P</p>
            <div>
                <div className='mb-2'>
                    <SecondaryButton onClick={() => syncLevels()} disabled={syncLevelsStatus === 'loading'}>Sync level data to GD database</SecondaryButton>
                    <p>Speed is capped at 0.6s per level to avoid getting rate limited. 7k demons take a little over 1 hour to sync :yuhh:</p>
                </div>
                <div className='mb-2'>
                    <SecondaryButton onClick={() => syncTwoPlayerLevels()} disabled={syncTwoPlayerLevelsStatus === 'loading'}>Sync two player levels</SecondaryButton>
                    <p>Gets all two player levels and updates the database.</p>
                </div>
                <div className='mb-2'>
                    <SecondaryButton onClick={() => fixDeviation()} disabled={fixDeviationStatus === 'loading'}>Recalculate level stats</SecondaryButton>
                    <p>Takes like 17 minutes</p>
                </div>
                <div className='mb-2'>
                    <DangerButton onClick={() => restartServer()} disabled={restartServerStatus === 'loading'}>Restart server</DangerButton>
                    <p>Self explanatory</p>
                </div>
            </div>
            <div className='divider my-4' />
            <BotSettings />
            <div className='divider my-4' />
            <h3 className='text-2xl'>Cool graphs</h3>
            <div className='grid grid-cols-2 gap-4'>
                <StatisticLineChart metricName={Metrics.REQUESTS} title='Amount of requests' />
                <StatisticLineChart metricName={Metrics.RESPONSE_TIME} title='Average API response time' />
            </div>
        </div>
    );
}