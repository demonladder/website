import type { AxiosInstance } from 'axios';
import type { Application } from '../../../api/types/Application';

export async function createApplication(APIClient: AxiosInstance, name: string) {
    return (await APIClient.post<Application>('/oauth/2/applications', { name })).data;
}
