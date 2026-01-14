import React from 'react';
import ReactDOM from 'react-dom/client';
import './styles.css';
import ms from 'ms';
import { keepPreviousData, QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { ReactQueryDevtools } from '@tanstack/react-query-devtools';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import NavbarNotificationProvider from './context/navbarNotification/NavbarNotificationProvider';
import './migrations';
import App from './App';
import AppProvider from './context/app/AppProvider';

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

root.render(
    <React.StrictMode>
        <QueryClientProvider client={queryClient}>
            <AppProvider>
                <NavbarNotificationProvider>
                    <App />
                    <ReactQueryDevtools initialIsOpen={false} />
                </NavbarNotificationProvider>
            </AppProvider>
        </QueryClientProvider>
        <ToastContainer theme='dark' pauseOnFocusLoss={false} position={window.innerWidth > 640 ? 'bottom-right' : 'top-center'} />
    </React.StrictMode>,
);
