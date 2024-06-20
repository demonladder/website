import APIClient from '../APIClient';

export default async function CreateTag(name: string, description: string) {
    await APIClient.post('/tags', { name, description });
}