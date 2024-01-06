import { useMutation } from '@tanstack/react-query';
import { DangerButton, SecondaryButton } from '../../../components/Button';
import APIClient from '../../../api/APIClient';
import { toast } from 'react-toastify';
import { BotSettings } from './BotSettings';

export default function Debugging() {
    function handleError() {
        toast.error('Error occurred');
    }

    const { mutate: syncLevels, status: syncLevelsStatus } = useMutation(async () => APIClient.post('/tests/syncLevels').catch(handleError));
    const { mutate: fixDeviation, status: fixDeviationStatus } = useMutation(async () => APIClient.post('/tests/fixDeviation', {}, { timeout: 6 * 60 * 1000 }).catch(handleError));
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
                    <SecondaryButton onClick={() => fixDeviation()} disabled={fixDeviationStatus === 'loading'}>Recalculate level stats</SecondaryButton>
                    <p>Takes like 5.5 minutes</p>
                </div>
                <div className='mb-2'>
                    <DangerButton onClick={() => restartServer()} disabled={restartServerStatus === 'loading'}>Restart server</DangerButton>
                    <p>Self explanatory</p>
                </div>
            </div>
            <div className='divider my-4' />
            <BotSettings />
        </div>
    );
}