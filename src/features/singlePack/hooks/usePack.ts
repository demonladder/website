import { useQuery } from '@tanstack/react-query';
import { getPack } from '../api/getPack';
import { AxiosError } from 'axios';
import { UseQueryOptionsWithoutKey } from '../../../types/UseQueryOptionsWithoutKey';

export default function usePack(packID: number, options: UseQueryOptionsWithoutKey<Awaited<ReturnType<typeof getPack>>, AxiosError> = {}) {
    return useQuery({
        ...options,
        queryKey: ['packs', packID],
        queryFn: () => getPack(packID),
    });
}
