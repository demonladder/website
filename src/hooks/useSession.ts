import { useQuery } from '@tanstack/react-query';
import { PermissionFlags } from '../features/admin/roles/PermissionFlags';
import { useCallback } from 'react';
import GetMe from '../api/auth/GetMe';
import APIClient from '../api/APIClient';

export default function useSession() {
    const { data: user, status } = useQuery({
        queryKey: ['me'],
        queryFn: GetMe,
    });

    const { data: has2FA } = useQuery({
        queryKey: ['has2FA'],
        queryFn: () => APIClient.get<boolean>('/auth/totp/is-enabled').then((res) => res.data),
    });

    const hasPermission = useCallback(
        (permission: PermissionFlags) => {
            if (!user) return false;

            const permissions = user.Roles.map((r) => r.PermissionBitField).reduce((acc, val) => acc | val, 0);

            if (permissions & PermissionFlags.ADMIN) return true;
            return (permissions & permission) !== 0;
        },
        [user],
    );

    const logout = useCallback(async () => {
        await APIClient.post('/account/logout');
        document.location.reload();
    }, []);

    return {
        user,
        hasPermission,
        logout,
        loadStatus: status,
        has2FA,
    };
}
