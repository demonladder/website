export function validateUsername(name: string): boolean {
    return name.match(/[a-zA-Z0-9._]{2,32}/)?.[0] === name;
}