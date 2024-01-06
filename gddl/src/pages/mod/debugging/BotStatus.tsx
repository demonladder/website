import { useQuery } from '@tanstack/react-query';
import { GetBotStatusRequest } from '../../../api/bot/requests/GetBotStatusRequest';

export default function BotStatus() {
    const { data} = useQuery({
        queryKey: ['botStatus'],
        queryFn: GetBotStatusRequest,
    });

    return (
        <span>{data?.status || 'Unknown'}</span>
    );
}