import APIClient from '../../APIClient';

export default async function SavePackMetaRequest(
    packID: number,
    categoryID: number,
    description?: string,
    achievementId?: string | null,
) {
    await APIClient.patch(`/packs/${packID}`, { description, categoryID, achievementId });
}
