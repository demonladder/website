import APIClient from '../../APIClient';

interface BotStatus {
    status: 'Online' | 'Offline';
}

export function GetBotStatusRequest(): Promise<BotStatus> {
    return APIClient.get('/bot/status').then((res) => res.data);
}