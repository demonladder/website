import { Difficulties, Rarity } from '../../level/types/LevelMeta';
import { List } from '../types/List';
import APIClient from '../../../api/APIClient';
import User from '../../../api/types/User';

export interface GetListResponse extends List {
    Owner: {
        ID: User['ID'];
        Name: User['Name'];
    };
    Levels: {
        LevelID: number;
        Position: number;
        AddedAt: string;
        UpdatedAt: string;
        Level: {
            Rating: number | null;
            Enjoyment: number | null;
            Meta: {
                Name: string;
                Creator: string;
                Difficulty: Difficulties;
                Rarity: Rarity;
            }
        }
    }[];
}

export async function getList(listID: number) {
    const res = await APIClient.get<GetListResponse>(`/list/${listID}`);
    return res.data;
}
