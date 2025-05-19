import APIClient from '../../../api/APIClient';
import Level from '../../level/types/Level';
import LevelMeta from '../../level/types/LevelMeta';

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
    }[];
    packs: number;
}

export async function getStats() {
    const res = await APIClient.get<Stats>('/stats');
    return res.data;
}
