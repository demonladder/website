import Cookies from 'js-cookie';

export type User = {
    ID: number,
    Name: string,
    Hardest: number,
    PermissionLevel: number,
}

export default {
    getUser(): User | null {
        return JSON.parse(''+localStorage.getItem('user'));
    },

    setCSRF(csrfToken: string) {
        localStorage.setItem('accessToken', csrfToken);
    },

    getCSRF() {
        return localStorage.getItem('accessToken');
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
}