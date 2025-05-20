import { useQuery } from '@tanstack/react-query';
import { getPackLevels } from '../api/getPackLevels';

export default function usePackLevels(packID?: number) {
    return useQuery({
        queryKey: ['packs', packID, 'levels'],
        queryFn: () => getPackLevels(packID ?? 0),
        enabled: packID !== undefined,
    });
}
