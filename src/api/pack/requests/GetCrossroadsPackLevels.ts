import APIClient from '../../APIClient';
import Level from '../../types/Level';
import LevelMeta from '../../types/LevelMeta';
import Song from '../../types/Song';

export interface GetCrossroadsPackLevelsResponse {
    LevelID: number;
    Name: LevelMeta['Name'];
    Rating: Level['Rating'];
    Enjoyment: Level['Enjoyment'];
    Difficulty: LevelMeta['Difficulty'];
    Song: Song['Name'];
    Creator: LevelMeta['Creator'];
    EX: 0 | 1;
    Path: string;
    Completed: 0 | 1;
}

export default async function GetCrossroadsPackLevels() {
    const res = await APIClient.get<GetCrossroadsPackLevelsResponse[]>(`/packs/${78}/levels`);
    return res.data;
}
