import APIClient from '../../APIClient';
import { AutoAcceptSettings } from './AutoAcceptSettings';

export default async function GetAutoAcceptSettings() {
    const res = await APIClient.get<AutoAcceptSettings>('/siteSettings/autoAccept');
    return res.data;
}
