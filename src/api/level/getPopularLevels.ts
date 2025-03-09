import APIClient from '../APIClient';
import Level from '../types/Level';
import LevelMeta from '../types/LevelMeta';

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
