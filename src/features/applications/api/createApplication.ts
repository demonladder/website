import APIClient from '../../../api/APIClient';
import type { Application } from '../../../api/types/Application';

export async function createApplication(name: string) {
    return (await APIClient.post<Application>('/oauth/2/applications', { name })).data;
}
