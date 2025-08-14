import APIClient from '../../../api/APIClient';

export async function getSupporters() {
    const res = await APIClient.get<{ ID: number, name: string }[]>('/kofi/supporters');
    return res.data;
}
