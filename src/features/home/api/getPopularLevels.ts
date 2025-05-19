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
    }
}

export async function getPopularLevels(): Promise<LevelPreviewDTO[]> {
    const res = await APIClient.get<LevelPreviewDTO[]>('/level/popular');
    return res.data;
}
