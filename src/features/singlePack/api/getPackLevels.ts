import APIClient from '../../../api/APIClient';
import Level from '../../level/types/Level';
import LevelMeta from '../../level/types/LevelMeta';
import PackLevel from '../types/PackLevel';

export type GetPackLevelsResponse = PackLevel & {
    Completed: 0 | 1,
    Level: {
        Rating: Level['Rating'],
        Enjoyment: Level['Enjoyment'],
        Meta: {
            Name: LevelMeta['Name'],
            Creator: LevelMeta['Creator'],
            Difficulty: LevelMeta['Difficulty'],
            Rarity: LevelMeta['Rarity'],
            Song: {
                Name: string,
            },
        },
    },
};

export async function getPackLevels(packID: number) {
    const res = await APIClient.get<GetPackLevelsResponse[]>(`/packs/${packID}/levels`);
    return res.data;
}
