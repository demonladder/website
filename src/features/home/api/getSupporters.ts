import APIClient from '../../../api/APIClient';

export async function getSupporters() {
    const res = await APIClient.get<{ fromName: string, rank: number, displayAmount: string }[]>('/kofi/supporters');
    return res.data;
}
