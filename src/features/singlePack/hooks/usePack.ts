import { QueryKey, useQuery, UseQueryOptions } from '@tanstack/react-query';
import { getPack } from '../api/getPack';
import { AxiosError } from 'axios';

export default function usePack(packID: number, options?: UseQueryOptions<
    Awaited<ReturnType<typeof getPack>>,
    AxiosError,
    Awaited<ReturnType<typeof getPack>>,
    QueryKey
>) {
    options = options ?? {};
    options.queryKey = ['packs', packID];
    options.queryFn = () => getPack(packID);
    return useQuery(options);
}
