import { useState, useEffect, useRef } from 'react';
import { PrimaryButton } from '../../../components/ui/buttons/PrimaryButton';
import CheckBox from '../../../components/input/CheckBox';
import FormGroup from '../../../components/form/FormGroup';
import SaveSiteSettings from '../../../api/settings/SaveSiteSettings';
import GetSiteSettings from '../../../api/settings/GetSiteSettings';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import FloatingLoadingSpinner from '../../../components/FloatingLoadingSpinner';
import { toast } from 'react-toastify';
import renderToastError from '../../../utils/renderToastError';
import AutoAccepter from './AutoAccepter';

export default function SiteSettings() {
    const queueEditLock = useRef<HTMLInputElement>(null);
    const submissionLock = useRef<HTMLInputElement>(null);
    const accountCreationLock = useRef<HTMLInputElement>(null);
    const userSettingLock = useRef<HTMLInputElement>(null);
    const accessTokenEnabled = useRef<HTMLInputElement>(null);
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
        if (accessTokenEnabled.current !== null) accessTokenEnabled.current.checked = data.isAccessTokenEnabled;
    }, [data]);

    function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
        e.preventDefault();
        if (queueEditLock.current === null || submissionLock.current === null || accountCreationLock.current === null || userSettingLock.current === null || accessTokenEnabled.current === null) return toast.error('An error occurred!');

        setIsMutating(true);
        void toast.promise(SaveSiteSettings({
            isQueueEditLocked: queueEditLock.current.checked,
            isSubmissionLocked: submissionLock.current.checked,
            isAccountCreationLocked: accountCreationLock.current.checked,
            isUserSettingsLocked: userSettingLock.current.checked,
            isAccessTokenEnabled: accessTokenEnabled.current.checked,
        }).then(() => queryClient.invalidateQueries(['siteSettings'])).finally(() => setIsMutating(false)), {
            pending: 'Saving...',
            success: 'Settings saved!',
            error: renderToastError,
        });
    }

    const isFetching = status === 'loading' || fetchStatus === 'fetching';

    return (
        <div>
            <section className='relative'>
                <h3 className='text-2xl'>Site Settings</h3>
                <p className='mb-3'>Only admins and above are able to change these settings!</p>
                <FloatingLoadingSpinner isLoading={isMutating || isFetching} />
                <form onSubmit={handleSubmit}>
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
                    <FormGroup>
                        <div className='flex items-center gap-2'>
                            <CheckBox id='accessTokenEnabled' ref={accessTokenEnabled} />
                            <label htmlFor='accessTokenEnabled' className='select-none'>Enable access token requirement</label>
                        </div>
                        <p className='text-sm text-gray-400'>If this setting is enabled, only requests from known access token users can use the API.</p>
                    </FormGroup>
                    <PrimaryButton type='submit' loading={isMutating || isFetching}>Save</PrimaryButton>
                </form>
            </section>
            <div className='my-4 divider'></div>
            <AutoAccepter />
        </div>
    );
}
