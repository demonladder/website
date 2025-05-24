import { useCallback, useMemo, useState } from 'react';
import { NavbarNotificationContext, Notification } from './NavbarNotificationContext';

export default function NavbarNotificationProvider({ children }: { children: React.ReactNode }) {
    const [notifications, setNotifications] = useState<Notification[]>([]);

    const addNotification = useCallback((ID: string, element: React.ReactNode) => {
        setNotifications((prev) => {
            if (!prev.find((n) => n.ID === ID)) return [...prev, { ID, element }];
            return prev;
        });
    }, []);

    const removeNotification = useCallback((ID: string) => {
        setNotifications((prev) => prev.filter((n) => n.ID !== ID));
    }, []);

    const contextValue = useMemo(() => ({
        notifications,
        addNotification,
        removeNotification,
    }), [notifications, addNotification, removeNotification]);

    return (
        <NavbarNotificationContext.Provider value={contextValue}>
            {children}
        </NavbarNotificationContext.Provider>
    );
}