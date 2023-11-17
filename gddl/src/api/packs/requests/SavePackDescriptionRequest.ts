import APIClient from '../../APIClient';

export function SavePackDescriptionRequest(packID: number, description: string, roleID: string) {
    return APIClient.post('/pack/meta', { packID, description, roleID });
}