import APIClient from '../APIClient';

interface WantData {
    bitField: number;
    DMTierLimit?: number;
}

export default async function GetWants() {
    const res = await APIClient.get<WantData>('/notifications/wants');
    return res.data;
}