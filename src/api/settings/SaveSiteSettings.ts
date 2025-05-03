import APIClient from '../APIClient';
import { SiteSettings } from '../types/SiteSettings';

export default async function SaveSiteSettings(settings: SiteSettings) {
    await APIClient.patch('/siteSettings', {
        isQueueEditLocked: settings.isQueueEditLocked,
        isSubmissionLocked: settings.isSubmissionLocked,
        isAccountCreationLocked: settings.isAccountCreationLocked,
        isUserSettingLocked: settings.isUserSettingsLocked,
        isAccessTokenEnabled: settings.isAccessTokenEnabled,
    });
}
