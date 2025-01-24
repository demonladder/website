export default function toFixed<T>(float: string | undefined, digits: number, def: T): string | T {
    if (!float) return def;
    if (isNaN(parseFloat(float))) return def;
    
    return parseFloat(float).toFixed(digits);
}
