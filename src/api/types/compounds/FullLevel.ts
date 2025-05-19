import Level from '../../../features/level/types/Level';
import LevelMeta from '../../../features/level/types/LevelMeta';
import Song from '../../../features/level/types/Song';

export type FullLevel = Level & { Meta: LevelMeta & { Song: Song; }; };
