import { createContext } from 'react';

export interface Notification {
    id: string;
    element: React.ReactNode;
}

interface Context {
    notifications: Notification[];
    addNotification: (element: React.ReactNode) => string;
    removeNotification: (ID: string) => void;
    pop: () => void;
}

const defaultContext: Context = {
    notifications: [],
    addNotification: () => 'foo',
    removeNotification: () => {},
    pop: () => {},
};

export const NavbarNotificationContext = createContext(defaultContext);
