import APIClient from '../APIClient';
import type StatRecord from '../types/StatRecord';
import type { Metrics } from './metrics';
import { padDataSet } from './padDataSet';

export interface GetStatsResponse {
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

export interface GetQueueResponse {
    distributionByTier: { Tier: number; TierCount: number }[];
}

class StatsClient {
    async getStats() {
        const res = await APIClient.get<GetStatsResponse>('/stats');
        return res.data;
    }

    async getQueue() {
        const res = await APIClient.get<GetQueueResponse>('/stats/queue');
        return res.data;
    }

    async getMetric(metricName: Metrics) {
        const data = await APIClient.get<StatRecord[]>(`/stats/${metricName}`).then((res) => res.data);
        return padDataSet(data);
    }
}

export const statsClient = new StatsClient();
