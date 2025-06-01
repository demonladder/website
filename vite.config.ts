import { defineConfig, loadEnv } from 'vite';
import react from '@vitejs/plugin-react';
import tailwindcss from '@tailwindcss/vite';

// https://vitejs.dev/config/
export default defineConfig(({ mode }) => {
    const env = loadEnv(mode, process.cwd(), '');

    return {
        plugins: [
            tailwindcss(),
            react(),
        ],
        define: {
            APP_VERSION: JSON.stringify(process.env.npm_package_version),
        },
        server: {
            proxy: {
                '/api': env.VITE_SERVER_URL,
            },
        },
    };
});
