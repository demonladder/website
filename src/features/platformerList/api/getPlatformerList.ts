import APIClient from '../../../api/APIClient';
import Level from '../../level/types/Level';
import LevelMeta from '../../level/types/LevelMeta';
import PlatformerList from '../types/PlatformerList';

export interface ListEntry extends PlatformerList {
    Level: {
        ID: number;
        Rating: Level['Rating'];
        Enjoyment: Level['Enjoyment'];
        Meta: {
            Name: string;
            Difficulty: LevelMeta['Difficulty'];
            Rarity: LevelMeta['Rarity'];
            Publisher: {
                name: string;
            };
        };
    };
}

export async function getPlatformerList() {
    const res = await APIClient.get<ListEntry[]>('/platformerList');
    return res.data;
}
