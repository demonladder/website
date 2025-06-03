import { useQuery } from '@tanstack/react-query';
import { getRoles } from '../../api/roles/getRoles';

export default function useRoles() {
    return useQuery({
        queryKey: ['roles'],
        queryFn: getRoles,
    });
}