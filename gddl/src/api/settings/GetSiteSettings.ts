import APIClient from '../APIClient';
import { SiteSettings } from '../types/SiteSettings';

export async function GetSiteSettings(): Promise<SiteSettings> {
    const res = await APIClient.get('/siteSettings');
    return res.data;
}