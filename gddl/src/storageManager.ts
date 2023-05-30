export type User = {
    ID: number,
    Name: string,
    Hardest: number,
}

export class StorageManager {
    static getUser(): User | null {
        return JSON.parse(''+localStorage.getItem('user'));
    }

    static setUser(csrf: string, user: User) {
        localStorage.setItem('csrf', csrf);
        localStorage.setItem('user', JSON.stringify(user));
    }

    static hasSession() {
        return localStorage.getItem('user') != null;
    }

    static deleteSession() {
        localStorage.removeItem('csrf');
        localStorage.removeItem('user');
    }
}