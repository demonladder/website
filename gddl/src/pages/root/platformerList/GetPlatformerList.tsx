import APIClient from '../../../api/APIClient';

export interface ListEntry {
    LevelID: number;
    Name: string;
    Enjoyment: number | null;
    Difficulty: string;
    Creator: string;
    Position: number;
}

export function GetPlatformerList(): Promise<ListEntry[]> {
    return APIClient.get('/platformerList').then((res) => res.data);
}