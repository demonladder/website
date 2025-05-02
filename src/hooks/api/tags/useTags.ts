import { useQuery, UseQueryOptions } from '@tanstack/react-query';
import GetTags from '../../../api/tags/GetTags';
import { AxiosError } from 'axios';

export function useTags(options: UseQueryOptions<Awaited<ReturnType<typeof GetTags>>, AxiosError> = {}) {
    return useQuery({
        queryKey: ['tags'],
        queryFn: GetTags,
        ...options,
    });
}
