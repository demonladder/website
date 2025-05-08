import useRoles from './api/useRoles';

export function useUserColor(_roles?: string | number[]) {
    const { data: roles } = useRoles();

    if (!roles) return undefined;
    if (_roles === undefined) return undefined;

    const userRoles = Array.isArray(_roles) ? _roles : _roles.split(',').map(Number);

    for (const role of roles.sort((a, b) => a.Ordering - b.Ordering)) {
        if (userRoles.includes(role.ID) && role.Color !== null) {
            return role.Color;
        }
    }

    return undefined;
}
