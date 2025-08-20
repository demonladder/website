import { ThemeContext } from './ThemeContext';
import { useLocalStorage } from 'usehooks-ts';

export default function ThemeProvider({ children }: { children?: React.ReactNode }) {
    const [enabled, setEnabled] = useLocalStorage('custom-theme-enabled', false);
    const [theme, setTheme] = useLocalStorage<Record<string, string>>('custom-theme', {});

    const reduced = Object.entries(theme).reduce((acc, cur) => ({
        ...acc,
        [`--color-theme-${cur[0]}`]: cur[1],
    }), {});

    function clear() {
        setTheme({});
        setEnabled(false);
    }

    return (
        <ThemeContext.Provider value={{ enabled, setEnabled, theme, set: setTheme, clear }}>
            <div className='min-h-dvh' style={enabled ? reduced : undefined}>
                {children}
            </div>
        </ThemeContext.Provider>
    );
}
