import APIClient from '../APIClient';
import type StatRecord from '../types/StatRecord';
import type { Metrics } from './metrics';
import { padDataSet } from './padDataSet';

export interface GetQueueResponse {
    distributionByTier: { Tier: number; TierCount: number }[];
}

class StatsClient {
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
