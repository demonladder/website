import APIClient from '../APIClient';
import { SiteSettings } from '../types/SiteSettings';

export default async function SaveSiteSettings(settings: SiteSettings) {
    await APIClient.post('/siteSettings', {
        queueEditLock: settings.isQueueEditLocked,
        submissionLock: settings.isSubmissionLocked,
        accountCreationLock: settings.isAccountCreationLocked,
        userSettingLock: settings.isUserSettingsLocked,
        isAccessTokenEnabled: settings.isAccessTokenEnabled,
    });
}