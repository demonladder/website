export default function toFixed<T>(float: string, digits: number, def: T): string | T {
    if (isNaN(parseFloat(float))) return def;
    
    return parseFloat(float).toFixed(digits);
}