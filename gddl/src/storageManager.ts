export type User = {
    ID: number,
    Name: string,
    Hardest: number,
}

export class StorageManager {
    static getUser(): User | null {
        return JSON.parse(''+localStorage.getItem('user'));
    }

    static setUser(token: string) {
        const payload = JSON.parse(atob(token.split('.')[1]));
        delete payload.iat;
        delete payload.exp;
        
        this.setJWT(token);
        localStorage.setItem('user', JSON.stringify(payload));
    }

    static hasSession() {
        return localStorage.getItem('accessToken') != null;
    }

    static deleteSession() {
        localStorage.removeItem('user');
        localStorage.removeItem('accessToken');
    }

    static setJWT(token: string) {
        localStorage.setItem('accessToken', token);
    }

    static getJWT() {
        return localStorage.getItem('accessToken');
    }

    static authHeader() {
        return { Authorization: 'Bearer ' + this.getJWT() }
    }
}