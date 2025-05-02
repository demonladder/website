import { UseQueryOptions, useQuery } from '@tanstack/react-query';
import GetSingleSubmission from '../../api/submissions/GetSingleSubmission';
import { AxiosError } from 'axios';

export function useSubmission(levelID: number, userID: number | undefined, options: UseQueryOptions<Awaited<ReturnType<typeof GetSingleSubmission>>, AxiosError>) {
    return useQuery({
        queryKey: ['submission', levelID, userID],
        queryFn: () => GetSingleSubmission(levelID, userID),
        ...options,
    });
}
