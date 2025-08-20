import { RouterProvider } from 'react-router/dom';
import { router } from './routes/AppRouter';
import { ShortcutProvider } from 'react-keybind';

export default function App() {
    return (
        <ShortcutProvider>
            <RouterProvider router={router} />
        </ShortcutProvider>
    );
}
