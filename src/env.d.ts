/// <reference types="vite/client" />

declare const APP_VERSION: string;

interface ImportMetaEnv {
    VITE_SERVER_URL: string;
    VITE_DISCORD_OAUTH: string;
    VITE_SESSION_ID_NAME: string;
    VITE_MAX_TIER: string;
    VITE_MINIMUM_REFRESH_RATE: string;
    VITE_CF_TURNSTILE_SITE_KEY: string;
}

interface ImportMeta {
    readonly env: ImportMetaEnv;
}
