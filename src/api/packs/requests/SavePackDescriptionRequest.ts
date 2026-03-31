import APIClient from '../../APIClient';

export async function savePackMetaRequest(
    packID: number,
    name: string,
    categoryID: number,
    description?: string,
    achievementId?: string | null,
) {
    await APIClient.patch(`/packs/${packID}`, { name, description, categoryID, achievementId });
}
