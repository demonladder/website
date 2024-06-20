import APIClient from '../../APIClient';
import { AutoAcceptSettings } from './AutoAcceptSettings';

export default async function GetAutoAcceptSettings() {
    return await APIClient.get<AutoAcceptSettings>('/siteSettings/autoAccept').then((res) => res.data);
}