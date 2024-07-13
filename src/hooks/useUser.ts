import { PermissionFlags } from '../pages/mod/roles/PermissionFlags';
import StorageManager from '../utils/StorageManager';

export default function useUser() {
    const storedUser = StorageManager.getUser();
    const hasPermission = (permission: PermissionFlags) => {
        if (!storedUser) return false;
        return storedUser?.Permissions & permission;
    };

    return {
        ID: storedUser?.ID,
        hasPermission,
    };
}