/// <reference types="vite/client" />

declare const APP_VERSION: string;

interface ImportMetaEnv {
    VITE_SERVER_URL: string;
    VITE_DISCORD_OAUTH: string;
    VITE_SESSION_ID_NAME: string;
    VITE_MINIMUM_REFRESH_RATE: string;
}

interface ImportMeta {
    readonly env: ImportMetaEnv;
}