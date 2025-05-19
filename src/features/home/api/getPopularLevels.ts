import APIClient from '../../../api/APIClient';
import Level from '../../../api/types/Level';
import LevelMeta from '../../../api/types/LevelMeta';

export interface LevelPreviewDTO {
    ID: number;
    Rating: Level['Rating'];
    Enjoyment: Level['Enjoyment'];
    Meta: {
        Name: string;
        Difficulty: LevelMeta['Difficulty'];
    }
}

export async function getPopularLevels(): Promise<LevelPreviewDTO[]> {
    const res = await APIClient.get<LevelPreviewDTO[]>('/level/popular');
    return res.data;
}
