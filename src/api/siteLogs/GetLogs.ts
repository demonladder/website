import APIClient from '../APIClient';
import LogResponse from '../types/LogResponse';

interface LogResponseData {
    count: number;
    logs: LogResponse[];
}

export default async function GetLogs(type: string, time: string, message: string, page: number): Promise<LogResponseData> {
    const res = await APIClient.get<LogResponseData>('/logs', { params: { type, time, message, page } });
    return res.data;
}
