import APIClient from '../APIClient';

export async function CreateList(title: string, description?: string): Promise<void> {
    await APIClient.post('/v2/list', { name: title, description: description || null });
}

export async function DeleteList(listID: number) {
    await APIClient.delete(`/v2/list/${listID}`);
}