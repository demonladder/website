import { useQuery } from '@tanstack/react-query';
import GetSingleSubmission from '../../api/submissions/GetSingleSubmission';
import { AxiosError } from 'axios';
import { UseQueryOptionsWithoutKey } from '../../types/UseQueryOptionsWithoutKey';

export function useSubmission(
    levelID: number,
    userID: number | undefined,
    options: UseQueryOptionsWithoutKey<Awaited<ReturnType<typeof GetSingleSubmission>>, AxiosError>,
) {
    return useQuery({
        ...options,
        queryKey: ['submission', levelID, userID],
        queryFn: () => GetSingleSubmission(levelID, userID),
        placeholderData: () => {
            return undefined;
        },
    });
}
