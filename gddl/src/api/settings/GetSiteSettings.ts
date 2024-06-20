import APIClient from '../APIClient';
import { SiteSettings } from '../types/SiteSettings';

export default async function GetSiteSettings() {
    const res = await APIClient.get<SiteSettings>('/siteSettings');
    return res.data;
}