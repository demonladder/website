import instance from './axios';

interface Stats {
    Submissions: number,
    PendingSubmissions: number,
    Users: number,
    Packs: number,
    DataLogs: {
        levelSearches: number,
        ratingsSubmitted: number,
        starbotRatingsSubmitted: number,
    }[],
}

export function GetStats(): Promise<Stats> {
    return instance.get('/stats').then((res) => res.data);
}