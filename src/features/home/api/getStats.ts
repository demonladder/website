import APIClient from '../../../api/APIClient';

interface Stats {
    users: {
        now: number;
        old: number;
    };
    registeredUsers: number;
    activeUsers: number;
    totalLevels: {
        now: number;
        old: number;
    };
    totalRatedLevels: number;
    submissions: {
        now: number;
        old: number;
    };
    pendingSubmissions: {
        now: number;
        old: number;
    };
    recentSubmissions: number;
    oldestQueuedSubmission?: string;
    topRaters: {
        UserID: number;
        Name: string;
    }[];
}

export async function getStats() {
    const res = await APIClient.get<Stats>('/stats');
    return res.data;
}
