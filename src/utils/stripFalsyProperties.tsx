export function stripFalsyProperties<T>(obj: Record<string, T | undefined>) {
    const newObj: Record<string, T> = {};
    for (const key of Object.keys(obj)) {
        if (obj[key]) newObj[key] = obj[key];
    }
    return newObj;
}
