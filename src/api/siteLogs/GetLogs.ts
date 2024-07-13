import APIClient from '../APIClient';
import LogResponse from '../types/LogResponse';

interface LogResponseData {
    Count: number;
    Logs: LogResponse[];
}

export default async function GetLogs(type: string, time: string, message: string, page: number): Promise<LogResponseData> {
    const res = await APIClient.get('/logs', { params: { type, time, message, page } });
    return res.data;
}