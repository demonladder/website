import APIClient from "./APIClient";

interface SiteSettings {
    isQueueEditLocked: boolean,
    isSubmissionLocked: boolean,
    isAccountCreationLocked: boolean,
    isUserSettingsLocked: boolean,
}

export function GetSiteSettings(): Promise<SiteSettings> {
    return APIClient.get('/siteSettings').then(res => res.data);
}

export function SaveSiteSettings(settings: SiteSettings): Promise<void> {
    return APIClient.post('/siteSettings', {
        queueEditLock: settings.isQueueEditLocked,
        submissionLock: settings.isSubmissionLocked,
        accountCreationLock: settings.isAccountCreationLocked,
        userSettingLock: settings.isUserSettingsLocked,
    });
}