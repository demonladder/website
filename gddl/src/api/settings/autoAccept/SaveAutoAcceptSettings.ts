import APIClient from '../../APIClient';
import { AutoAcceptSettings } from './AutoAcceptSettings';

export default async function SaveAutoAcceptSettings(settings: AutoAcceptSettings) {
    await APIClient.post('/siteSettings/autoAccept', settings);
}