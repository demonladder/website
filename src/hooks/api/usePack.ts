import { useQuery, UseQueryOptions } from '@tanstack/react-query';
import GetSinglePack from '../../api/pack/requests/GetSinglePack';

interface Options {
    enabled: UseQueryOptions['enabled'];
}

export default function usePack(packID: number, options?: Options) {
    return useQuery({
        queryKey: ['packs', packID],
        queryFn: () => GetSinglePack(packID),
        ...(options ?? {}),
    });
}
