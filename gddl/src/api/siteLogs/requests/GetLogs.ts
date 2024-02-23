import APIClient from '../../APIClient';
import LogResponse from '../responses/LogResponse';

interface LogResponseData {
    Count: number;
    Logs: LogResponse[];
}

export default function GetLogs(type: string, time: string, message: string, page: number): Promise<LogResponseData> {
    return APIClient.get('/logs', { params: { type, time, message, page } }).then((res) => res.data);
}