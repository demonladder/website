import APIClient from '../APIClient';
import { AutoAcceptSettings } from './AutoAcceptSettings';

export default async function SaveAutoAcceptSettings(settings: AutoAcceptSettings) {
    return await APIClient.post('/siteSettings/autoAccept', settings);
}