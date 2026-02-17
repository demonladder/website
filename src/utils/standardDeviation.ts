// O(n) if average is specified, otherwise O(2n)
export default function standardDeviation(data: number[], average?: number): number {
    if (data.length === 0) return 0;

    const avg = average ?? data.reduce((acc, cur) => acc + cur, 0) / data.length;

    return Math.sqrt(data.reduce((acc, cur) => acc + (cur - avg) ** 2, 0) / data.length);
}
