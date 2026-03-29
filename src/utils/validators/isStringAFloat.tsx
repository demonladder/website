export function isStringAFloat(num: string): boolean {
    return /^-?\d+\.\d+$/.test(num);
}
