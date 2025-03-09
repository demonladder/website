import { useQuery } from '@tanstack/react-query';
import GetPackLevels from '../../api/pack/requests/GetPackLevels';

export default function usePackLevels(packID?: number) {
    return useQuery({
        queryKey: ['packs', packID, 'levels'],
        queryFn: () => GetPackLevels(packID ?? 0),
        enabled: packID !== undefined,
    });
}
