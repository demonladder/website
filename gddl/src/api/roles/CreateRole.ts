import APIClient from '../APIClient';

export default async function CreateRole(name: string) {
    await APIClient.post('/roles', { name });
}