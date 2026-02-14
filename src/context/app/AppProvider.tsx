import useLocalStorage from '../../hooks/useLocalStorage';
import { AppContext, AppSettings } from './AppContext';

export default function AppProvider({ children }: { children?: React.ReactNode }) {
    const [app, setApp] = useLocalStorage<Partial<AppSettings>>('app', {});

    function setter<K extends keyof AppSettings>(key: K, value: AppSettings[K]) {
        setApp({
            ...app,
            [key]: value,
        });
    }

    return (
        <AppContext.Provider
            value={{
                ...app,
                set: setter,
            }}
        >
            {children}
        </AppContext.Provider>
    );
}
