import APIClient from '../../APIClient';

interface WantData {
    bitField: number;
    DMTierLimit?: number;
}

export function GetWants(): Promise<WantData> {
    return APIClient.get('/notifications/wants').then((res) => res.data);
}