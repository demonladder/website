import { merge } from 'lodash';

export type User = {
    ID: number,
    Name: string,
    Hardest: number,
    PermissionLevel: number,
    iat: number,  // Issued at
    exp: number,  // Expires at
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
        return JSON.parse('' + localStorage.getItem('user'));
    },

    getToken() {
        return localStorage.getItem('token');
    },

    hasSession() {
        const user = this.getUser();

        if (user === null) return false;

        return Date.now() < user.exp * 1000;
    },

    setUser(jwt: string) {
        const payload = jwt.split('.')[1];
        const parsed = JSON.parse(atob(payload));
        localStorage.setItem('user', JSON.stringify(parsed));
        localStorage.setItem('token', jwt);
    },

    hasPermissions() {
        return this.getUser()?.PermissionLevel || 0 > 0;
    },

    deleteSession() {
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
        };

        // Merge default with stored in case new settings get added
        return merge(
            defaulSettings,
            JSON.parse(storage),
        );
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
    }
}