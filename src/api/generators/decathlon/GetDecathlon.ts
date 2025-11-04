import APIClient from '../../APIClient';
import Level from '../../../features/level/types/Level';
import LevelMeta from '../../../features/level/types/LevelMeta';
import { List } from '../../../features/list/types/List';
import ListLevel from '../../types/ListLevel';

interface DecathlonMetaData {
    reRolls: number;
    levelsCompleted: number;
}

type Decathlon = Omit<List, 'Type' | 'Description'> & {
    Type: 1;
    Description: DecathlonMetaData;
    levels: (ListLevel & {
        Level: Omit<Level, 'RatingCount' | 'EnjoymentCount' | 'SubmissionCount'> & { Meta: LevelMeta };
    })[];
};

interface APIResponse {
    list: List;
    levels: (ListLevel & {
        Level: Omit<Level, 'RatingCount' | 'EnjoymentCount' | 'SubmissionCount'> & { Meta: LevelMeta };
    })[];
}

export default async function GetDecathlon(): Promise<Decathlon> {
    const res = await APIClient.get<APIResponse>('/decathlon');
    return {
        ...res.data.list,
        levels: res.data.levels,
        Type: 1,
        Description: JSON.parse(res.data.list.Description!) as DecathlonMetaData,
    };
}
