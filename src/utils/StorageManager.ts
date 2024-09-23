import { merge } from 'lodash';
import Cookies from 'js-cookie';

export type User = {
    userID: number,
}

interface Settings {
    submission: {
        defaultRefreshRate: number,
        defaultDevice: string,
    },
}

type RecursivePartial<T> = {
    [P in keyof T]?:
    T[P] extends (infer U)[] ? RecursivePartial<U>[] :
    T[P] extends object | undefined ? RecursivePartial<T[P]> :
    T[P];
};

function generateDefaultSettings(): Settings {
    return {
        submission: {
            defaultRefreshRate: 60,
            defaultDevice: '1',
        },
    };
}

export default {
    getUser(): User | null {
        const cookie = Cookies.get(import.meta.env.VITE_SESSION_ID_NAME);
        if (!cookie) return null;
        return JSON.parse(atob(cookie)) as User;
    },

    hasSession() {
        return Cookies.get('gddl.sid') !== undefined;
    },

    deleteSession() {
        Cookies.remove('gddl.sid');
        Cookies.remove('gddl.sid.sig');
        localStorage.removeItem('user');
        localStorage.removeItem('accessToken');
        localStorage.removeItem('token');
    },

    getIsRounded() {
        const storage = localStorage.getItem('isRounded');
        if (storage === null) return false;
        return JSON.parse(storage) === true;
    },
    setRounded(state: boolean) {
        localStorage.setItem('isRounded', JSON.stringify(state));
    },

    getUseExperimental() {
        const storage = localStorage.getItem('useExperimental');
        if (storage === null) return false;
        return JSON.parse(storage) === true;
    },
    setUseExperimental(state: boolean) {
        localStorage.setItem('useExperimental', JSON.stringify(state));
    },

    getSettings(): Settings {
        const defaulSettings = generateDefaultSettings();
        const storage = localStorage.getItem('settings');

        if (storage === null) {
            // Create settings
            localStorage.setItem('settings', JSON.stringify(defaulSettings));

            return defaulSettings;
        }

        // Merge default with stored in case new settings get added
        return merge(
            defaulSettings,
            JSON.parse(storage),
        ) as Settings;
    },

    setSetting(setting: RecursivePartial<Settings>) {
        localStorage.setItem('settings', JSON.stringify(merge(
            this.getSettings(),
            setting,
        )));
    },

    getHighlightCompleted() {
        const storage = localStorage.getItem('highlightCompleted');
        if (storage === null) return false;
        return JSON.parse(storage) === true;
    },
    setHighlightCompleted(state: boolean) {
        localStorage.setItem('highlightCompleted', JSON.stringify(state));
    },

    getUseBackground() {
        const storage = localStorage.getItem('background');
        if (storage === null) return false;
        return JSON.parse(storage) === true;
    },
    setUseBackground(state: boolean) {
        localStorage.setItem('background', JSON.stringify(state));
    },
}