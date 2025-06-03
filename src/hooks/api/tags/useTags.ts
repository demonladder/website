import { useQuery, UseQueryOptions } from '@tanstack/react-query';
import { getTags } from '../../../api/tags/getTags';
import { AxiosError } from 'axios';

export function useTags(options: UseQueryOptions<Awaited<ReturnType<typeof getTags>>, AxiosError> = {}) {
    return useQuery({
        queryKey: ['tags'],
        queryFn: getTags,
        ...options,
    });
}
