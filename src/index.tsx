import React from 'react';
import ReactDOM from 'react-dom/client';
import './styles.css';
import ms from 'ms';
import { keepPreviousData, QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { ReactQueryDevtools } from '@tanstack/react-query-devtools';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import StorageManager from './utils/StorageManager';
import MenuContextProvider from './components/ui/menuContext/MenuContextContainer';
import { HelmetProvider } from 'react-helmet-async';
import NavbarNotificationProvider from './context/NavbarNotification/NavbarNotificationProvider';
import './migrations';
import App from './App';

const queryClient = new QueryClient({
    defaultOptions: {
        queries: {
            staleTime: ms('2h'),
            gcTime: ms('2h') + ms('5m'),
            retry: false,
            placeholderData: keepPreviousData,
        },
    },
});

function createRoot() {
    const root = document.createElement('div');
    root.id = 'root';
    document.body.appendChild(root);
    return root;
}

document.documentElement.setAttribute('data-theme', localStorage.getItem('theme') ?? ((window.matchMedia && window.matchMedia('(prefers-color-scheme: dark')).matches ? 'dark' : 'white'));
document.documentElement.setAttribute('data-font', localStorage.getItem('font') ?? 'default');

const rootElement = document.getElementById('root') ?? createRoot();
const root = ReactDOM.createRoot(rootElement);
if (StorageManager.getIsRounded()) rootElement.classList.add('round');

declare const kofiWidgetOverlay: {
    draw: (username: string, options: Record<string, string>) => void;
};

if (import.meta.env.PROD) kofiWidgetOverlay.draw('gddemonladder', {
    'type': 'floating-chat',
    'floating-chat.donateButton.text': 'Donate',
    'floating-chat.donateButton.background-color': '#00b9fe',
    'floating-chat.donateButton.text-color': '#fff',
});

root.render(
    <React.StrictMode>
        <QueryClientProvider client={queryClient}>
            <HelmetProvider>
                <MenuContextProvider>
                    <NavbarNotificationProvider>
                        <App />
                        <ReactQueryDevtools initialIsOpen={false} />
                    </NavbarNotificationProvider>
                </MenuContextProvider>
            </HelmetProvider>
        </QueryClientProvider>
        <ToastContainer theme='dark' position={window.innerWidth > 640 ? 'bottom-right' : 'top-center'} />
    </React.StrictMode>,
);
