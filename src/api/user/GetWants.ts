import APIClient from '../APIClient';

interface WantData {
    bitField: number;
    DMTierLimit?: number;
    roleManagement: string | null;
}

export default async function GetWants() {
    const res = await APIClient.get<WantData>('/wants');
    return res.data;
}
