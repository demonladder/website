export default function isStringAnInteger(num: string): boolean {
    return num.match(/^-?\d+$/) !== null;
}