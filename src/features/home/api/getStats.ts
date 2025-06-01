import APIClient from '../../../api/APIClient';

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
    topRaters: {
        UserID: number;
        Name: string;
    }[];
}

export async function getStats() {
    const res = await APIClient.get<Stats>('/stats');
    return res.data;
}
