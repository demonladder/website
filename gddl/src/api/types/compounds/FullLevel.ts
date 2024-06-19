import Level from '../Level';
import LevelMeta from '../LevelMeta';
import Song from '../Song';

export type FullLevel = Level & { Meta: LevelMeta & { Song: Song; }; };