import User from '../api/types/User';
import useRoles from './api/useRoles';

export default function useUserPermissions(user?: User): number {
    const { data: roles } = useRoles();
    if (!user || !roles) return 0;

    return user.RoleIDs
        .split(',')
        .map(Number)
        .map((ID) => roles.find((r) => r.ID === ID)?.PermissionBitField)
        .filter((p) => p !== undefined)
        .reduce((acc, p) => (acc as number) | (p as number), 0) as number;  // I literally don't know why tsc can't infer this type
}