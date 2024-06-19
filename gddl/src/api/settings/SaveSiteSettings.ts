import APIClient from '../APIClient';
import { SiteSettings } from '../types/SiteSettings';

export async function SaveSiteSettings(settings: SiteSettings): Promise<void> {
    await APIClient.post('/siteSettings', {
        queueEditLock: settings.isQueueEditLocked,
        submissionLock: settings.isSubmissionLocked,
        accountCreationLock: settings.isAccountCreationLocked,
        userSettingLock: settings.isUserSettingsLocked,
    });
}