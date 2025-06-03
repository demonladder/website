import { UseQueryOptions } from '@tanstack/react-query';

export type UseQueryOptionsWithoutKey<T, E> = Omit<UseQueryOptions<T, E>, 'queryKey' | 'queryFn'>;
