import { useQuery } from '@tanstack/react-query';
import GetRoles from '../../api/roles/GetRoles';

export default function useRoles() {
    return useQuery({
        queryKey: ['roles'],
        queryFn: GetRoles,
    });
}