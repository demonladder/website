import Level from '../Level';
import LevelMeta from '../LevelMeta';

export interface ShortLevel {
    ID: number;
    Rating: Level['Rating'];
    Enjoyment: Level['Enjoyment'];
    Meta: {
        Name: LevelMeta['Name'];
        Length: LevelMeta['Length'];
    };
}