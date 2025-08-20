import { createContext } from 'react';

export const ThemeContext = createContext<{
    enabled: boolean;
    setEnabled: (enabled: boolean) => void;
    theme: Record<string, string>;
    set: (theme: Record<string, string>) => void;
    clear: () => void;
}>({
    enabled: false,
    setEnabled: () => { },
    theme: {},
    set: () => { },
    clear: () => { },
});
