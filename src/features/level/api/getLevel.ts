import APIClient from '../../../api/APIClient';
import { FullLevel } from '../../../api/types/compounds/FullLevel';

export async function getLevel(ID: number | null): Promise<FullLevel | null> {
    if (ID === null) return null;

    const response = await APIClient.get<FullLevel>(`/level/${ID}`);
    return response.data;
}
