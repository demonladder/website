import React, { useState, useEffect } from "react";

export function ParseDiff(diff: number): string {
    switch(diff) {
        case 0:
            return 'Official Demon';
        case 1:
            return 'Easy Demon';
        case 2:
            return 'Medium Demon';
        case 3:
            return 'Hard Demon';
        case 4:
            return 'Insane Demon';
        case 5:
            return 'Extreme Demon';
        default:
            return 'Unknown'
    }
}

export function ToFixed(f: string, d: number, def: string): string {
    if (isNaN( parseFloat(f))) return def;
    return parseFloat(f).toFixed(d);
}

export function useSessionStorage(key: string, defaultValue: any) {
    const [value, setValue] = useState(JSON.parse(sessionStorage.getItem(key) || '{}')?.value || defaultValue);

    useEffect(() => {
        sessionStorage.setItem(key, JSON.stringify({value}));
    }, [value]);
    
    return [value, setValue];
}