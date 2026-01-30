import APIClient from '../../../api/APIClient';
import { LevelPreviewDTO } from './getPopularLevels';

export async function getTrendingLevels(): Promise<LevelPreviewDTO[]> {
    const res = await APIClient.get<LevelPreviewDTO[]>('/levels/trending');
    return res.data;
}
