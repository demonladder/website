import APIClient from '../APIClient';

interface WantData {
    bitField: number;
    DMTierLimit?: number;
}

export async function GetWants(): Promise<WantData> {
    const res = await APIClient.get('/notifications/wants');
    return res.data;
}