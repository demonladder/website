import APIClient from '../../APIClient';

export function SavePackMetaRequest(packID: number, description: string, categoryID: number, roleID: string) {
    return APIClient.post('/pack/meta', { packID, description, categoryID, roleID });
}