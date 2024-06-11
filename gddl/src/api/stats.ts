import APIClient from './APIClient';
import { FullLevel } from './levels';

interface Stats {
    users: number;
    registeredUsers: number;
    activeUsers: number;
    totalLevels: number;
    totalRatedLevels: number;
    submissions: number;
    pendingSubmissions: number;
    recentSubmissions: number;
    oldestQueuedSubmission?: string;
    topPopularLevels: (Omit<FullLevel, 'Meta'> & { Meta: Omit<FullLevel['Meta'], 'Song'> })[];
    topRaters: {
        UserID: number;
        Name: string;
        Ratings: number;
    }[];
    packs: number;
}

interface HealthStats {
    warns: number;
    errors: number;
    dataLogs: {
        levelSearches: number;
        ratingsSubmitted: number;
        starbotRatingsSubmitted: number;
    }[];
}

export function GetStats(): Promise<Stats> {
    return APIClient.get('/stats').then((res) => res.data);
}

export function GetHealthStats(): Promise<HealthStats> {
    return APIClient.get('/stats/health').then((res) => res.data);
}