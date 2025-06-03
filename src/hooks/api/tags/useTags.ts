import { useQuery } from '@tanstack/react-query';
import { getTags } from '../../../api/tags/GetTags';
import { AxiosError } from 'axios';
import { UseQueryOptionsWithoutKey } from '../../../types/UseQueryOptionsWithoutKey';

export function useTags(options: UseQueryOptionsWithoutKey<Awaited<ReturnType<typeof getTags>>, AxiosError> = {}) {
    return useQuery({
        queryKey: ['tags'],
        queryFn: getTags,
        ...options,
    });
}
