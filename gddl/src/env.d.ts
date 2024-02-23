/// <reference types="vite/client" />

declare const APP_VERSION: string;
declare const MINIMUM_REFRESH_RATE: number;

interface ImportMetaEnv {
    VITE_SERVER_URL: string;
    VITE_DISCORD_OAUTH: string;
}

interface ImportMeta {
    readonly env: ImportMetaEnv;
}