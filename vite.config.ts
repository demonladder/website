import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite';

// https://vitejs.dev/config/
export default defineConfig({
    plugins: [
        tailwindcss(),
        react(),
    ],
    define: {
        APP_VERSION: JSON.stringify(process.env.npm_package_version),
    },
});
