import APIClient from '../APIClient';
import StatRecord from '../types/StatRecord';
import { padDataSet } from './padDataSet';

export enum Metrics {
    SUBMIT = 'submit',
    RESPONSE_TIME = 'APIResponseTime',
    REQUESTS = 'requests',
}

export default async function GetStatistic(metricName: Metrics) {
    const data = await APIClient.get<StatRecord[]>(`/stats/${metricName}`).then((res) => res.data);
    return padDataSet(data);
}