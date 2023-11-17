import Cookies from 'js-cookie';

export type User = {
    ID: number,
    Name: string,
    Hardest: number,
    PermissionLevel: number,
}

interface Settings {
    submission: {
        defaultRefreshRate: number,
    },
}

function generateDefaultSettings(): Settings {
    return {
        submission: {
            defaultRefreshRate: 60,
        },
    };
}

export default {
    getUser(): User | null {
        return JSON.parse(''+localStorage.getItem('user'));
    },

    getToken() {
        return localStorage.getItem('token');
    },

    hasSession() {
        return Cookies.get('session') !== undefined;
    },

    setUser(jwt: string) {
        const payload = jwt.split('.')[1];
        const parsed = JSON.parse(atob(payload));
        delete parsed.iat;
        delete parsed.exp;
        localStorage.setItem('user', JSON.stringify(parsed));
        localStorage.setItem('token', jwt);
    },

    hasPermissions() {
        return this.getUser()?.PermissionLevel || 0 > 0;
    },

    deleteSession() {
        localStorage.removeItem('user');
        localStorage.removeItem('accessToken');
        Cookies.remove('session');
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
        const storage = localStorage.getItem('settings');
        if (storage === null) {
            // Create settings
            const defaulSettings = generateDefaultSettings();
            localStorage.setItem('settings', JSON.stringify(defaulSettings));

            return defaulSettings;
        };

        // Merge default with stored in case new settings get added
        return {
            ...generateDefaultSettings(),
            ...JSON.parse(storage),
        };
    },

    setSetting(setting: Partial<Settings>) {
        localStorage.setItem('settings', JSON.stringify({
            ...generateDefaultSettings(),
            ...setting,
        }));
    }
}