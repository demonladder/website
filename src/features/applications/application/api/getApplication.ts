import APIClient from '../../../../api/APIClient';
import { Application } from '../../../../api/types/Application';

export async function getApplication(appID: string) {
    return (await APIClient.get<Application>(`/oauth/2/applications/${appID}`)).data;
}
