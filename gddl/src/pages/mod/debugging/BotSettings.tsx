import { useState } from 'react';
import { DangerButton, PrimaryButton, SecondaryButton } from '../../../components/Button';
import { useQueryClient } from '@tanstack/react-query';
import BotStatus from './BotStatus';
import { DeactivateBotRequest } from '../../../api/bot/requests/DeactivateBotRequest';
import { ActivateBotRequest } from '../../../api/bot/requests/ActivateBotRequest';
import { UpdateBotCommandsRequest } from '../../../api/bot/requests/UpdateBotCommandsRequest';

export function BotSettings() {
    const [botMutating, setBotMutating] = useState(false);
    const queryClient = useQueryClient();

    function startBot() {
        if (botMutating) return;

        setBotMutating(true);
        ActivateBotRequest().then(() => {
            queryClient.invalidateQueries(['botStatus']);
        }).finally(() => {
            setBotMutating(false);
        });
    }
    function stopBot() {
        if (botMutating) return;

        setBotMutating(true);
        DeactivateBotRequest().then(() => {
            queryClient.invalidateQueries(['botStatus']);
        }).finally(() => {
            setBotMutating(false);
        });
    }
    function updateCommands() {
        if (botMutating) return;

        setBotMutating(true);
        UpdateBotCommandsRequest().finally(() => {
            setBotMutating(false);
        });
    }

    return <div>
        <h3 className='text-2xl'>Bot settings</h3>
        <p>Bot status: <BotStatus /></p>
        <div className='mt-1 flex gap-2'>
            <PrimaryButton onClick={startBot} disabled={botMutating}>Activate</PrimaryButton>
            <DangerButton onClick={stopBot} disabled={botMutating}>Deactivate</DangerButton>
        </div>
        <div className='mt-4'>
            <SecondaryButton onClick={updateCommands} disabled={botMutating}>Update commands</SecondaryButton>
            <p className='text-sm text-gray-400'>Sends the current structure of all the bot's commands to Discord so the data refreshes in the Discord client</p>
        </div>
    </div>;
}
