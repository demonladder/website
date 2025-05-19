import Level from '../../../features/level/types/Level';
import LevelMeta from '../../../features/level/types/LevelMeta';

export interface ShortLevel {
    ID: number;
    Rating: Level['Rating'];
    Enjoyment: Level['Enjoyment'];
    Meta: {
        Name: LevelMeta['Name'];
        Length: LevelMeta['Length'];
    };
}