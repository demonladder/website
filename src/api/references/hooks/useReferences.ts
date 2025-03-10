import { useQuery } from '@tanstack/react-query';
import { getReferences } from '../getReferences';

export function useReferences() {
    return useQuery({
        queryKey: ['references'],
        queryFn: getReferences,
    });
}
