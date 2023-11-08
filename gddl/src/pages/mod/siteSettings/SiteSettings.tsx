import { useState, useEffect, useRef } from 'react';
import { DangerButton, PrimaryButton } from '../../../components/Button';
import { CheckBox } from '../../../components/Input';
import FormGroup from '../../../components/form/FormGroup';
import { GetSiteSettings, SaveSiteSettings } from '../../../api/settings';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import FloatingLoadingSpinner from '../../../components/FloatingLoadingSpinner';
import { toast } from 'react-toastify';
import renderToastError from '../../../utils/renderToastError';
import BotStatus from './BotStatus';
import { DeactivateBotRequest } from '../../../api/bot/requests/DeactivateBotRequest';
import { ActivateBotRequest } from '../../../api/bot/requests/ActivateBotRequest';

export default function SiteSettings() {
    const queueEditLock = useRef<HTMLInputElement>(null);
    const submissionLock = useRef<HTMLInputElement>(null);
    const accountCreationLock = useRef<HTMLInputElement>(null);
    const userSettingLock = useRef<HTMLInputElement>(null);
    const [isMutating, setIsMutating] = useState(false);

    const queryClient = useQueryClient();

    const { data, status, fetchStatus } = useQuery({
        queryKey: ['siteSettings'],
        queryFn: GetSiteSettings,
    });

    useEffect(() => {
        if (data === undefined) return;

        if (queueEditLock.current !== null) queueEditLock.current.checked = data.isQueueEditLocked;
        if (submissionLock.current !== null) submissionLock.current.checked = data.isSubmissionLocked;
        if (accountCreationLock.current !== null) accountCreationLock.current.checked = data.isAccountCreationLocked;
        if (userSettingLock.current !== null) userSettingLock.current.checked = data.isUserSettingsLocked;
    }, [data]);

    function handleSubmit(e: React.MouseEvent) {
        e.preventDefault();
        if (queueEditLock.current === null || submissionLock.current === null || accountCreationLock.current === null || userSettingLock.current === null) return toast.error('An error occurred!');
        
        setIsMutating(true);
        toast.promise(SaveSiteSettings({
            isQueueEditLocked: queueEditLock.current.checked,
            isSubmissionLocked: submissionLock.current.checked,
            isAccountCreationLocked: accountCreationLock.current.checked,
            isUserSettingsLocked: userSettingLock.current.checked,
        }).then(() => queryClient.invalidateQueries(['siteSettings'])).finally(() => setIsMutating(false)), {
            pending: 'Saving...',
            success: 'Settings saved!',
            error: renderToastError,
        });
    }

    const [botMutating, setBotMutating] = useState(false);
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

    const isFetching = status === 'loading' || fetchStatus === 'fetching';

    return (
        <div>
            <h3 className='text-2xl'>Site Settings</h3>
            <p className='mb-3'>Only admins and above are able to change these settings!</p>
            <FloatingLoadingSpinner isLoading={isMutating || isFetching} />
            <form>
                <FormGroup>
                    <div className='flex items-center gap-2'>
                        <CheckBox id='queueEditLock' ref={queueEditLock} />
                        <label htmlFor='queueEditLock' className='select-none'>Lock approval and denial of submissions</label>
                    </div>
                    <p className='text-sm text-gray-400'>Staff won't be able to approve or deny submissions in the queue</p>
                </FormGroup>
                <FormGroup>
                    <div className='flex items-center gap-2'>
                        <CheckBox id='submissionLock' ref={submissionLock} />
                        <label htmlFor='submissionLock' className='select-none'>Lock submissions</label>
                    </div>
                    <p className='text-sm text-gray-400'>Users won't be able to submit any ratings</p>
                </FormGroup>
                <FormGroup>
                    <div className='flex items-center gap-2'>
                        <CheckBox id='accountLock' ref={accountCreationLock} />
                        <label htmlFor='accountLock' className='select-none'>Lock account creation</label>
                    </div>
                    <p className='text-sm text-gray-400'>Users won't be able to create new accounts</p>
                </FormGroup>
                <FormGroup>
                    <div className='flex items-center gap-2'>
                        <CheckBox id='userSettingLock' ref={userSettingLock} />
                        <label htmlFor='userSettingLock' className='select-none'>Lock user settings</label>
                    </div>
                    <p className='text-sm text-gray-400'>Users won't be able to edit their introduction, tier preferences etc.</p>
                </FormGroup>
                <PrimaryButton type='submit' onClick={handleSubmit} disabled={isMutating || isFetching}>Save</PrimaryButton>
            </form>
            <div className='my-4 divider'></div>
            <h3 className='text-2xl'>Bot settings</h3>
            <p>Bot status: <BotStatus /></p>
            <div className='mt-1 flex gap-2'>
                <PrimaryButton onClick={startBot}>Activate</PrimaryButton>
                <DangerButton onClick={stopBot}>Deactivate</DangerButton>
            </div>
        </div>
    );
}