import APIClient from '../../APIClient';

export function CreateTag(name: string, description: string) {
    return APIClient.post('/tags', { name, description });
}