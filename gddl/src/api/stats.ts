import APIClient from './APIClient';

interface Stats {
    Submissions: number,
    PendingSubmissions: number,
    Users: number,
    Packs: number,
    Warns: number,
    Errors: number,
    DataLogs: {
        levelSearches: number,
        ratingsSubmitted: number,
        starbotRatingsSubmitted: number,
    }[],
}

export function GetStats(): Promise<Stats> {
    return APIClient.get('/stats').then((res) => res.data);
}