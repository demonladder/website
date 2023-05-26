export function hasSession() {
    return localStorage.getItem('user') != null;
}

export function setUser(csrf, user) {
    localStorage.setItem('csrf', csrf);
    localStorage.setItem('user', user);
}