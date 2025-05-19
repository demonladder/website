import APIClient from '../../APIClient';
import Level from '../../../features/level/types/Level';
import LevelMeta from '../../../features/level/types/LevelMeta';
import PackLevel from '../../types/PackLevel';

export type GetPackLevelsResponse = PackLevel & {
    Completed: 0 | 1,
    Level: {
        Rating: Level['Rating'],
        Enjoyment: Level['Enjoyment'],
        Meta: {
            Name: LevelMeta['Name'],
            Creator: LevelMeta['Creator'],
            Difficulty: LevelMeta['Difficulty'],
            Song: {
                Name: string,
            },
        },
    },
};

export default async function GetPackLevels(packID: number) {
    const res = await APIClient.get<GetPackLevelsResponse[]>(`/packs/${packID}/levels`);
    return res.data;
}
