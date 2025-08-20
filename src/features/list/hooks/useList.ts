import { QueryKey, QueryOptions, useQuery, useQueryClient } from '@tanstack/react-query';
import { getList } from '../api/getList';

export function useList(listID: number, options?: Omit<QueryOptions<Awaited<ReturnType<typeof getList>>>, 'queryKey' | 'queryFn'>) {
    const queryClient = useQueryClient();
    const queryKey: QueryKey = ['list', listID];
    const query = useQuery({
        queryKey,
        queryFn: () => getList(listID),
        ...options,
    });

    return {
        ...query,
        getData: () => queryClient.getQueryData<typeof query['data']>(queryKey),
    };
}
