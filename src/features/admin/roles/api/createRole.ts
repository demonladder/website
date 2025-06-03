import APIClient from '../../../../api/APIClient';

export async function createRole(name: string) {
    await APIClient.post('/roles', { name });
}
