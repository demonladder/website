import APIClient from '../../../api/APIClient';
import { Difficulties, Rarity } from '../../level/types/LevelMeta';

export interface GetFavoriteLevelsResponse {
    ID: number;
    Rating: number | null;
    Enjoyment: number | null;
    Showcase: string | null;
    Meta: {
        Name: string;
        Creator: string;
        Difficulty: Difficulties;
        Rarity: Rarity;
    }
}

export async function getFavoriteLevels(userID: number) {
    const res = await APIClient.get<GetFavoriteLevelsResponse[]>(`/user/${userID}/favorites`);
    return res.data;
}

export async function getLeastFavoriteLevels(userID: number) {
    const res = await APIClient.get<GetFavoriteLevelsResponse[]>(`/user/${userID}/least-favorites`);
    return res.data;
}
