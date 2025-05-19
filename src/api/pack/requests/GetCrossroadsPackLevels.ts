import APIClient from '../../APIClient';
import Level from '../../../features/level/types/Level';
import LevelMeta from '../../../features/level/types/LevelMeta';
import Song from '../../../features/level/types/Song';

interface PackLevelDTO {
    LevelID: number;
    Path: string;
    Completed: 0 | 1;
    Level: {
        ID: number;
        Rating: Level['Rating'];
        Enjoyment: Level['Enjoyment'];
        Meta: {
            Name: LevelMeta['Name'];
            Creator: LevelMeta['Creator'];
            Difficulty: LevelMeta['Difficulty'];
            Song: {
                Name: Song['Name'];
            };
        };
    };
}

export interface GetCrossroadsPackLevels {
    ID: number;
    Rating: Level['Rating'];
    Enjoyment: Level['Enjoyment'];
    Meta: {
        Name: LevelMeta['Name'];
        Creator: LevelMeta['Creator'];
        Difficulty: LevelMeta['Difficulty'];
        Song: {
            Name: Song['Name'];
        };
    };
    Path: string;
    Completed: 0 | 1;
}

export default async function GetCrossroadsPackLevels(): Promise<GetCrossroadsPackLevels[]> {
    const res = await APIClient.get<PackLevelDTO[]>('/packs/78/levels');
    return res.data.map((level) => ({
        ID: level.Level.ID,
        Rating: level.Level.Rating,
        Enjoyment: level.Level.Enjoyment,
        Meta: {
            Name: level.Level.Meta.Name,
            Creator: level.Level.Meta.Creator,
            Difficulty: level.Level.Meta.Difficulty,
            Song: {
                Name: level.Level.Meta.Song.Name,
            },
        },
        Path: level.Path,
        Completed: level.Completed,
    }));
}
