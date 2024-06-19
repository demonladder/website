import APIClient from '../../APIClient';
import { AutoAcceptSettings } from './AutoAcceptSettings';

export default async function GetAutoAcceptSettings(): Promise<AutoAcceptSettings> {
    return await APIClient.get('/siteSettings/autoAccept').then((res) => res.data);
}