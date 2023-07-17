import Cookies from 'js-cookie';

export type User = {
    ID: number,
    Name: string,
    Hardest: number,
}

export class StorageManager {
    static getUser(): User | null {
        return JSON.parse(''+localStorage.getItem('user'));
    }

    static setCSRF(csrfToken: string) {
        localStorage.setItem('accessToken', csrfToken);
    }

    static getCSRF() {
        return localStorage.getItem('accessToken');
    }

    static hasSession() {
        return Cookies.get('session') !== undefined;
    }

    static setUser(jwt: string) {
        const payload = jwt.split('.')[1];
        const parsed = JSON.parse(atob(payload));
        delete parsed.iat;
        delete parsed.exp;
        localStorage.setItem('user', JSON.stringify(parsed));
    }

    static deleteSession() {
        localStorage.removeItem('user');
        localStorage.removeItem('accessToken');
        Cookies.remove('session');
    }
}