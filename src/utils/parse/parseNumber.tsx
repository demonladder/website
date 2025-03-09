export function parseNumber(value: string): number | undefined {
    const parsed = parseFloat(value);

    if (isNaN(parsed)) return undefined;
    return parsed;
}
