export function validateUsername(name: string): boolean {
    return /^[a-zA-Z0-9._]{2,32}$/.test(name);
}
