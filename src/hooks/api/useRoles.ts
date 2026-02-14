import { useQuery } from '@tanstack/react-query';
import { rolesClient } from '../../api';

export default function useRoles() {
    return useQuery({
        queryKey: ['roles'],
        queryFn: () => rolesClient.list(),
    });
}
