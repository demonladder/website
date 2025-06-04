import { useQuery } from '@tanstack/react-query';
import { getAccessTokens } from '../api/getAccessTokens';

export function useAccessTokens() {
    return useQuery({
        queryKey: ['accessTokens'],
        queryFn: getAccessTokens,
    });
}
