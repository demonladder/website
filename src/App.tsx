import { RouterProvider } from 'react-router/dom';
import { router } from './routes/AppRouter';
import { ShortcutProvider } from 'react-keybind';
import { useQueryClient } from '@tanstack/react-query';

export default function App() {
    const queryClient = useQueryClient();

    return (
        <ShortcutProvider>
            <RouterProvider router={router(queryClient)} />
        </ShortcutProvider>
    );
}
