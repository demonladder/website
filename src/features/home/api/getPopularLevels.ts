import APIClient from '../../../api/APIClient';
import Level from '../../level/types/Level';
import LevelMeta from '../../level/types/LevelMeta';

export interface LevelPreviewDTO {
    ID: number;
    Rating: Level['Rating'];
    Enjoyment: Level['Enjoyment'];
    Meta: {
        Name: string;
        Difficulty: LevelMeta['Difficulty'];
        Rarity: LevelMeta['Rarity'];
    };
}

export async function getPopularLevels(): Promise<LevelPreviewDTO[]> {
    const res = await APIClient.get<LevelPreviewDTO[]>('/levels/popular');
    return res.data;
}
