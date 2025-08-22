import { RouterProvider } from 'react-router/dom';
import { router } from './routes/AppRouter';
import { ShortcutProvider } from 'react-keybind';
import { useQueryClient } from '@tanstack/react-query';
import ThemeProvider from './context/theme/ThemeProvider';
import BetaGuard from './layouts/BetaGuard';

export default function App() {
    const queryClient = useQueryClient();

    return (
        <ShortcutProvider>
            <ThemeProvider>
                <BetaGuard>
                    <RouterProvider router={router(queryClient)} />
                </BetaGuard>
            </ThemeProvider>
        </ShortcutProvider>
    );
}
