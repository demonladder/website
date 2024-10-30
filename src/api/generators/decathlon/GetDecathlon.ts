import APIClient from '../../APIClient';
import Level from '../../types/Level';
import LevelMeta from '../../types/LevelMeta';
import List from '../../types/List';
import ListLevel from '../../types/ListLevel';

interface DecathlonMetaData {
    reRolls: number;
    levelsCompleted: number;
}

type Decathlon = Omit<List, 'Type' | 'Description'> & {
    Type: 1,
    Description: DecathlonMetaData,
    levels: (ListLevel & {
        Level: Omit<Level, 'RatingCount' | 'EnjoymentCount' | 'SubmissionCount'> & { Meta: LevelMeta },
    })[]
};

export default async function GetDecathlon(): Promise<Decathlon> {
    const res = await APIClient.get<List & {levels: (ListLevel & {
        Level: Omit<Level, 'RatingCount' | 'EnjoymentCount' | 'SubmissionCount'> & { Meta: LevelMeta },
    })[]}>('/decathlon');
    return {
        ...res.data,
        Type: 1,
        Description: JSON.parse(res.data.Description as string) as DecathlonMetaData,
    };
}