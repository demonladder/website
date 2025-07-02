import APIClient from '../../APIClient';

export default async function SavePackMetaRequest(packID: number, categoryID: number, description?: string, roleID?: string) {
    await APIClient.patch(`/packs/${packID}`, { description, categoryID, roleID });
}
