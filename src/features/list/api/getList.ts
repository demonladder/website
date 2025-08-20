import LevelMeta from '../../level/types/LevelMeta';
import { List } from '../types/List';
import APIClient from '../../../api/APIClient';
import User from '../../../api/types/User';
import ListLevel from '../../../api/types/ListLevel';
import { Level } from '../../../api/types/Level';
import { Publisher } from '../../../api/types/Publisher';

export interface GetListResponse extends Pick<List, 'ID' | 'Name' | 'Description' | 'OwnerID'> {
    Owner: Pick<User, 'ID' | 'Name'>;
    Levels: (Pick<ListLevel, 'LevelID' | 'Position'> & {
        Level: Pick<Level, 'Rating' | 'Enjoyment'> & {
            Meta: Pick<LevelMeta, 'Name' | 'Difficulty' | 'Rarity'> & {
                Publisher?: Pick<Publisher, 'name'>;
            };
        };
    })[];
}

export async function getList(listID: number) {
    const res = await APIClient.get<GetListResponse>(`/list/${listID}`);
    return res.data;
}
