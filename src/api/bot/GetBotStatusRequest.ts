import APIClient from '../APIClient';

interface BotStatus {
    status: 'Online' | 'Offline';
}

export default async function GetBotStatusRequest() {
    const res = await APIClient.get<BotStatus>('/bot/status');
    return res.data;
}
