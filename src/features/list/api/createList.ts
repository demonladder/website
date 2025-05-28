import APIClient from '../../../api/APIClient';

export async function createList(title: string, levelID: number, description?: string) {
    await APIClient.post('/list', { name: title, initialLevelID: levelID, description: description || null });
}
