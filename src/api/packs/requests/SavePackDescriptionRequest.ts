import APIClient from '../../APIClient';

export default async function SavePackMetaRequest(packID: number, description?: string, categoryID?: number, roleID?: string) {
    await APIClient.patch(`/packs/${packID}`, { description, categoryID, roleID });
}
