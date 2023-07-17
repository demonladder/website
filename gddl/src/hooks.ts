import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { StorageManager } from "./storageManager";

export function useLocalStorage<T>(key: string, defaultValue: T): [T, React.Dispatch<React.SetStateAction<T>>] {
    const stored = localStorage.getItem(key);
    const [value, setValue] = useState(stored === null ? defaultValue : JSON.parse(stored) as T);

    useEffect(() => {
        localStorage.setItem(key, JSON.stringify(value));
    }, [value]);
    
    return [value, setValue];
}

export function useSessionStorage<T>(key: string, defaultValue: T): [T, React.Dispatch<React.SetStateAction<T>>] {
    const stored = sessionStorage.getItem(key);
    const [value, setValue] = useState(stored === null ? defaultValue : JSON.parse(stored) as T);

    useEffect(() => {
        sessionStorage.setItem(key, JSON.stringify(value));
    }, [value]);
    
    return [value, setValue];
}

export function useLogout() {
    const navigate = useNavigate();

    return () => {
        StorageManager.deleteSession();

        navigate('/');
    }
}