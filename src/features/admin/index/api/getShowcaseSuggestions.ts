import APIClient from '../../../../api/APIClient';
import { Difficulties, Rarity } from '../../../level/types/LevelMeta';

interface GetShowcaseSuggestionsResponse {
    ID: number;
    videoID: string;
    userID: number;
    levelID: number;
    createdAt: string;
    updatedAt: string;
    level: {
        Rating: number | null;
        Enjoyment: number | null;
        Meta: {
            Name: string;
            Difficulty: Difficulties;
            Rarity: Rarity;
            Publisher?: {
                name: string;
            };
        };
    };
    user: {
        Name: string;
    };
}

export interface GetShowcaseSuggestionsOptions {
    page?: number;
    limit?: number;
}

export async function getShowcaseSuggestions(options?: GetShowcaseSuggestionsOptions) {
    const res = await APIClient.get<{
        limit: number;
        total: number;
        page: number;
        suggestions: GetShowcaseSuggestionsResponse[],
    }>('showcase', { params: options });
    return res.data;
}
