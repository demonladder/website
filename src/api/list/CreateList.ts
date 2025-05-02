import APIClient from '../APIClient';

export default async function CreateList(title: string, levelID: number, description?: string) {
    await APIClient.post('/list', { name: title, initialLevelID: levelID, description: description || null });
}
