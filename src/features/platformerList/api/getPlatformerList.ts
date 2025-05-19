import APIClient from '../../../api/APIClient';
import Level from '../../level/types/Level';
import LevelMeta from '../../level/types/LevelMeta';
import PlatformerList from '../types/PlatformerList';

export interface ListEntry extends PlatformerList {
    Level: Level & {
        Meta: LevelMeta;
    };
}

export async function getPlatformerList() {
    const res = await APIClient.get<ListEntry[]>('/platformerList');
    return res.data;
}
