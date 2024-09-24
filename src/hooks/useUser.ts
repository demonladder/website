import { useQuery } from '@tanstack/react-query';
import { PermissionFlags } from '../pages/mod/roles/PermissionFlags';
import GetUser from '../api/user/GetUser';
import { useCallback, useMemo } from 'react';
import useCookieReadonly from './useCookieReadonly';

export default function useUser() {
    const [sessionCookie, removeSessionCookie, refreshSessionCookie] = useCookieReadonly(import.meta.env.VITE_SESSION_ID_NAME);

    const userID = useMemo(() => {
        const decodedSessionCookie = atob(sessionCookie ?? btoa('null'));
        const parsedSessionCookie = JSON.parse(decodedSessionCookie) as { userID: number } | null;
        return parsedSessionCookie?.userID;
    }, [sessionCookie]);

    const { data, status } = useQuery({
        queryKey: ['user', userID],
        queryFn: () => GetUser(userID ?? -1),
        enabled: !!userID,
    });

    const hasPermission = useCallback((permission: PermissionFlags) => {
        if (!data) return false;

        const permissions = data.Roles
            .map((r) => r.PermissionBitField)
            .reduce((acc, val) => acc | val, 0);
        return (permissions & permission) !== 0;
    }, [data]);

    const login = useCallback(() => {
        refreshSessionCookie();
    }, [refreshSessionCookie]);

    const logout = useCallback(() => {
        removeSessionCookie();
    }, [removeSessionCookie]);

    return {
        user: sessionCookie ? data : undefined,
        hasPermission,
        login,
        logout,
        loadStatus: status,
    };
}