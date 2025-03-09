import Role from '../api/types/Role';

export function permissionsFromRoles(roles: Role[]) {
    return roles.reduce((acc, role) => acc | role.PermissionBitField, 0);
}
