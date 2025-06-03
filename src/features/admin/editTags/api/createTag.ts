import APIClient from '../../../../api/APIClient';

export async function createTag(name: string, description: string) {
    await APIClient.post('/tags', { name, description });
}
