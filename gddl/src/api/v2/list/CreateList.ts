import APIClient from '../../APIClient';

export default async function CreateList(title: string, description?: string) {
    await APIClient.post('/v2/list', { name: title, description: description || null });
}