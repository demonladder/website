import APIClient from '../../../api/APIClient';
import type { Application } from '../../../api/types/Application';

export async function getMyApps() {
    return (await APIClient.get<Application[]>('/oauth/2/applications/@me')).data;
}
