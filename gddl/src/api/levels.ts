import APIClient from './APIClient';
import { ShortLevel } from './types/compounds/ShortLevel';
import { FullLevel } from './types/compounds/FullLevel';

export async function GetLevel(ID: number | null): Promise<FullLevel | null> {
    if (ID === null) return null;

    const response = (await APIClient.get(`/v2/level/${ID}`)).data as FullLevel | null;
    if (response === null) {
        return null;
    }

    return response;
}

export async function GetShortLevel(ID: number | null): Promise<ShortLevel | null> {
    if (ID === null) return null;

    const response = (await APIClient.get<(ShortLevel & { Length: number }) | null>(`/level/${ID}/short`)).data;
    return response;
}

export function AddLevelToDatabase(levelID: number) {
    return APIClient.post('/level', { levelID });
}