export default function toFixed(f: string, d: number, def: string): string {
    if (isNaN(parseFloat(f))) return def;
    
    return parseFloat(f).toFixed(d);
}