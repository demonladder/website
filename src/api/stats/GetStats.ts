import APIClient from '../APIClient';
import Level from '../types/Level';
import LevelMeta from '../types/LevelMeta';

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
    topPopularLevels: (Level & { Meta: LevelMeta })[];
    topRaters: {
        UserID: number;
        Name: string;
        Ratings: number;
    }[];
    packs: number;
}

export default async function GetStats() {
    const res = await APIClient.get<Stats>('/stats');
    return res.data;
}