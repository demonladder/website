import APIClient from '../APIClient';
import { FullLevel } from '../types/compounds/FullLevel';

export default async function GetLevel(ID: number | null): Promise<FullLevel | null> {
    if (ID === null) return null;

    const response = await APIClient.get<FullLevel>(`/level/${ID}`);
    return response.data;
}