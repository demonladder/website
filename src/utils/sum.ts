export function sum(values: number[]): number {
    return values.reduce((acc, cur) => acc + cur, 0);
}
