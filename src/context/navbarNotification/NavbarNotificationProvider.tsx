import { useCallback, useMemo, useState } from 'react';
import { NavbarNotificationContext, Notification } from './NavbarNotificationContext';

export default function NavbarNotificationProvider({ children }: { children: React.ReactNode }) {
    const [notifications, setNotifications] = useState<Notification[]>([]);

    const addNotification = useCallback((element: React.ReactNode) => {
        const id = crypto.randomUUID();
        setNotifications((prev) => [...prev, { id, element }]);
        return id;
    }, []);

    const removeNotification = useCallback((ID: string) => {
        setNotifications((prev) => prev.filter((n) => n.id !== ID));
    }, []);

    const popNotification = () => {
        setNotifications((prev) => prev.slice(0, -1));
    };

    const contextValue = useMemo(
        () => ({
            notifications,
            addNotification,
            removeNotification,
            pop: popNotification,
        }),
        [notifications, addNotification, removeNotification],
    );

    return <NavbarNotificationContext.Provider value={contextValue}>{children}</NavbarNotificationContext.Provider>;
}
