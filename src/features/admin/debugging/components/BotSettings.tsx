import { useState } from 'react';
import { DangerButton } from '../../../../components/ui/buttons/DangerButton';
import { SecondaryButton } from '../../../../components/ui/buttons/SecondaryButton';
import { PrimaryButton } from '../../../../components/ui/buttons/PrimaryButton';
import { useQueryClient } from '@tanstack/react-query';
import BotStatus from '../../../../features/admin/debugging/components/BotStatus';
import DeactivateBotRequest from '../../../../api/bot/DeactivateBotRequest';
import ActivateBotRequest from '../../../../api/bot/ActivateBotRequest';
import UpdateBotCommandsRequest from '../../../../api/bot/UpdateBotCommandsRequest';

export function BotSettings() {
    const [botMutating, setBotMutating] = useState(false);
    const queryClient = useQueryClient();

    function startBot() {
        if (botMutating) return;

        setBotMutating(true);
        void ActivateBotRequest().then(() => {
            void queryClient.invalidateQueries({ queryKey: ['botStatus'] });
        }).finally(() => {
            setBotMutating(false);
        });
    }
    function stopBot() {
        if (botMutating) return;

        setBotMutating(true);
        void DeactivateBotRequest().then(() => {
            void queryClient.invalidateQueries({ queryKey: ['botStatus'] });
        }).finally(() => {
            setBotMutating(false);
        });
    }
    function updateCommands() {
        if (botMutating) return;

        setBotMutating(true);
        void UpdateBotCommandsRequest().finally(() => {
            void setBotMutating(false);
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
