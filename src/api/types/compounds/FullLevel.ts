import Level from '../../../features/level/types/Level';
import LevelMeta from '../../../features/level/types/LevelMeta';
import Song from '../../../features/level/types/Song';
import { Publisher } from '../Publisher';

export type FullLevel = Level & {
    Meta: LevelMeta & {
        Song: Song;
        Publisher?: Publisher;
    };
    AREDLPosition?: number;
    DifficultyIndex?: number;
    PopularityIndex?: number;
};
