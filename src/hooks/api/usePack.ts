import { QueryKey, useQuery, UseQueryOptions } from '@tanstack/react-query';
import GetSinglePack from '../../api/pack/requests/GetSinglePack';
import { AxiosError } from 'axios';

export default function usePack(packID: number, options?: UseQueryOptions<
    Awaited<ReturnType<typeof GetSinglePack>>,
    AxiosError,
    Awaited<ReturnType<typeof GetSinglePack>>,
    QueryKey
>) {
    options = options ?? {};
    options.queryKey = ['packs', packID];
    options.queryFn = () => GetSinglePack(packID);
    return useQuery(options);
}
