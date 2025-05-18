import { redirect } from 'react-router-dom';
import { permissionsFromRoles } from '../../utils/permissionsFromRoles';
import { PermissionFlags } from './roles/PermissionFlags';
import GetMe from '../../api/auth/GetMe';

export async function modLoader() {
    try {
        const currentUser = await GetMe();

        const permissions = permissionsFromRoles(currentUser.Roles);
        if (permissions & PermissionFlags.STAFF_DASHBOARD) return null;
        return redirect('/');
    } catch {
        return redirect('/');
    }
}
