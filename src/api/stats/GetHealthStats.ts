import APIClient from '../APIClient';

interface HealthStats {
    warns: number;
    errors: number;
}

export default async function GetHealthStats(): Promise<HealthStats> {
    const res = await APIClient.get<HealthStats>('/stats/logCounts');
    return res.data;
}
