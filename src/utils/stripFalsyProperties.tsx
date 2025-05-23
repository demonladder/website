export function stripFalsyProperties<T = undefined>(obj: Record<string, T>) {
    const newObj: Record<string, T> = {};
    for (const key of Object.keys(obj)) {
        if (obj[key]) newObj[key] = obj[key];
    }
    return newObj;
}
