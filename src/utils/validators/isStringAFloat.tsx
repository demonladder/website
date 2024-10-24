export default function isStringAFloat(num: string): boolean {
    return num.match(/^-?\d+\.\d+$/) !== null;
}