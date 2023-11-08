import APIClient from '../../axios';

interface BotStatus {
    status: 'Online' | 'Offline';
}

export function GetBotStatusRequest(): Promise<BotStatus> {
    return APIClient.get('/bot/status').then((res) => res.data);
}