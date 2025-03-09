import { redirect } from 'react-router-dom';
import APIClient from '../../api/APIClient';
import User from '../../api/types/User';
import { permissionsFromRoles } from '../../utils/permissionsFromRoles';
import Role from '../../api/types/Role';
import { PermissionFlags } from './roles/PermissionFlags';

export async function modLoader() {
    try {
        const currentUser = (await APIClient.get<User & { Roles: Role[] }>('/auth/me')).data;

        const permissions = permissionsFromRoles(currentUser.Roles);
        if (permissions & PermissionFlags.STAFF_DASHBOARD) return null;
        return redirect('/');
    } catch (_) {
        return redirect('/');
    }
}
