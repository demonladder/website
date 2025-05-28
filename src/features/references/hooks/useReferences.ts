import { useQuery } from '@tanstack/react-query';
import { getReferences } from '../api/getReferences';

export function useReferences() {
    return useQuery({
        queryKey: ['references'],
        queryFn: getReferences,
    });
}
