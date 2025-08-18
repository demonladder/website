import APIClient from '../../APIClient';
import Level from '../../../features/level/types/Level';
import LevelMeta from '../../../features/level/types/LevelMeta';
import Song from '../../../features/level/types/Song';
import { Publisher } from '../../types/Publisher';

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
            Difficulty: LevelMeta['Difficulty'];
            Rarity: LevelMeta['Rarity'];
            Song: {
                Name: Song['Name'];
            };
            Publisher: {
                name: Publisher['name'];
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
        Difficulty: LevelMeta['Difficulty'];
        Rarity: LevelMeta['Rarity'];
        Song: {
            Name: Song['Name'];
        };
        Publisher: {
            name: Publisher['name'];
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
            Difficulty: level.Level.Meta.Difficulty,
            Rarity: level.Level.Meta.Rarity,
            Song: {
                Name: level.Level.Meta.Song.Name,
            },
            Publisher: {
                name: level.Level.Meta.Publisher.name,
            },
        },
        Path: level.Path,
        Completed: level.Completed,
    }));
}
