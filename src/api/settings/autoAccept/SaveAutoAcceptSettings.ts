import APIClient from '../../APIClient';
import { AutoAcceptSettings } from './AutoAcceptSettings';

export default async function SaveAutoAcceptSettings(settings: Partial<AutoAcceptSettings>) {
    await APIClient.patch('/siteSettings/autoAccept', settings);
}
