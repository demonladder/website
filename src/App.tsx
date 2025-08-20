import { RouterProvider } from 'react-router/dom';
import { router } from './routes/AppRouter';
import { ShortcutProvider } from 'react-keybind';
import { useQueryClient } from '@tanstack/react-query';
import ThemeProvider from './context/theme/ThemeProvider';

export default function App() {
    const queryClient = useQueryClient();

    return (
        <ShortcutProvider>
            <ThemeProvider>
                <RouterProvider router={router(queryClient)} />
            </ThemeProvider>
        </ShortcutProvider>
    );
}
