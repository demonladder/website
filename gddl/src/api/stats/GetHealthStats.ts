import APIClient from '../APIClient';

interface HealthStats {
    warns: number;
    errors: number;
    dataLogs: {
        levelSearches: number;
        ratingsSubmitted: number;
        starbotRatingsSubmitted: number;
    }[];
}

export default async function GetHealthStats() {
    const res = await APIClient.get<HealthStats>('/stats/health');
    return res.data;
}