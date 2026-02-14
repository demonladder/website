import { useQuery } from '@tanstack/react-query';
import { tagsClient } from '../../../api';
import { AxiosError } from 'axios';
import { UseQueryOptionsWithoutKey } from '../../../types/UseQueryOptionsWithoutKey';

export function useTags(
    options: UseQueryOptionsWithoutKey<Awaited<ReturnType<typeof tagsClient.list>>, AxiosError> = {},
) {
    return useQuery({
        ...options,
        queryKey: ['tags'],
        queryFn: () => tagsClient.list(),
    });
}
