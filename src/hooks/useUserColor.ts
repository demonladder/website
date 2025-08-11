import useRoles from './api/useRoles';
import { useUserRoles } from './useUserRoles';

export function useUserColor(userID: number) {
    const { data: roles } = useRoles();
    const { data: userRoles } = useUserRoles(userID);

    if (!roles) return undefined;
    if (!userRoles) return undefined;

    for (const role of roles.sort((a, b) => a.Ordering - b.Ordering)) {
        if (userRoles.find((r) => r.ID === role.ID) && role.Color !== null) {
            return role.Color;
        }
    }

    return undefined;
}
