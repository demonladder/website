import APIClient from '../../../api/APIClient';
import { Publisher } from '../../../api/types/Publisher';
import Level from '../../level/types/Level';
import LevelMeta from '../../level/types/LevelMeta';
import PackLevel from '../types/PackLevel';

export interface GetPackLevelsResponse extends PackLevel {
    Completed: 0 | 1;
    Level: {
        Rating: Level['Rating'];
        Enjoyment: Level['Enjoyment'];
        Meta: {
            Name: LevelMeta['Name'];
            Difficulty: LevelMeta['Difficulty'];
            Rarity: LevelMeta['Rarity'];
            Song: {
                Name: string,
            },
            Publisher?: {
                name: Publisher['name'];
            };
        };
    };
}

export async function getPackLevels(packID: number) {
    const res = await APIClient.get<GetPackLevelsResponse[]>(`/packs/${packID}/levels`);
    return res.data;
}
