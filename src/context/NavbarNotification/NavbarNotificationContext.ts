import { createContext } from 'react';

export interface Notification {
    ID: string;
    element: React.ReactNode;
}

interface Context {
    notifications: Notification[];
    addNotification: (ID: string, element: React.ReactNode) => void;
    removeNotification: (ID: string) => void;
}

const defaultContext: Context = {
    notifications: [],
    addNotification: () => {},
    removeNotification: () => {},
};

export const NavbarNotificationContext = createContext(defaultContext);