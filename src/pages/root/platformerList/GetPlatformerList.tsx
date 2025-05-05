import APIClient from '../../../api/APIClient';
import Level from '../../../api/types/Level';
import LevelMeta from '../../../api/types/LevelMeta';
import PlatformerList from '../../../api/types/PlatformerList';

export interface ListEntry extends PlatformerList {
    Level: Level & {
        Meta: LevelMeta;
    };
}

export async function GetPlatformerList() {
    const res = await APIClient.get<ListEntry[]>('/platformerList');
    return res.data;
}
