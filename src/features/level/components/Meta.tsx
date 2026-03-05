import Surface from '../../../components/layout/Surface';
import { secondsToHumanReadable } from '../../../utils/secondsToHumanReadable.ts';
import { LevelLengths } from '../types/LevelMeta.ts';
import Tooltip from '../../../components/ui/Tooltip.tsx';
import { clamp } from '../../../utils/clamp.ts';
import map from '../../../utils/map.ts';
import { Song } from './Song.tsx';
import IDButton from '../../../components/ui/IDButton';
import { FullLevel } from '../../../api/types/compounds/FullLevel.ts';

const levelLengths = {
    1: 'Tiny',
    2: 'Short',
    3: 'Medium',
    4: 'Long',
    5: 'XL',
    6: 'Platformer',
};

interface Props {
    level: FullLevel;
}

export function Meta({ level }: Props) {
    const density =
        level.Meta.seconds !== null && level.Meta.objects !== null ? level.Meta.objects / level.Meta.seconds : null;

    return (
        <Surface variant='700' className='flex flex-wrap gap-2 my-2'>
            <Song
                author={level.Meta.Song.Author}
                name={level.Meta.Song.Name}
                id={level.Meta.SongID}
                size={level.Meta.Song.Size}
            />
            <div className='grow md:text-lg flex flex-wrap justify-around items-center gap-1'>
                {level.DifficultyIndex !== undefined && (
                    <Surface variant='600'>
                        <p>Position</p>
                        <p className='text-xl'>
                            <b>#{level.DifficultyIndex}</b>
                        </p>
                    </Surface>
                )}
                <Surface variant='600'>
                    <p>Popularity</p>
                    <p className='text-xl'>
                        <b>#{level.PopularityIndex ?? '-'}</b>
                    </p>
                </Surface>
                <Surface variant='600'>
                    <p>Submitters</p>
                    <p className='text-xl'>
                        <b>{level.SubmissionCount}</b>
                    </p>
                </Surface>
                <Surface variant='600'>
                    <p>Length</p>
                    <p className='text-xl'>
                        <b>
                            {level.Meta.Length !== LevelLengths.XL || (level.Meta.seconds ?? 120) < 240
                                ? levelLengths[level.Meta.Length]
                                : Math.floor((level.Meta.seconds ?? 120) / 120) + 'XL'}
                        </b>
                    </p>
                </Surface>
                {level.Meta.seconds !== null && (
                    <Surface variant='600'>
                        <p>Time</p>
                        <p>
                            <b>{secondsToHumanReadable(level.Meta.seconds, true)}</b>
                        </p>
                    </Surface>
                )}
                {density !== null && (
                    <Surface variant='600'>
                        <Tooltip label='Average objects per second. Color indicates optimization.'>
                            <p>Density</p>
                            <p>
                                <b
                                    style={{
                                        color: `color-mix(in oklab, lightgreen ${clamp(map(density, 300, 2500, 1, 0), 0, 1) ** 0.5 * 100}%, #FF5252)`,
                                    }}
                                >
                                    {density.toFixed()} o/s
                                </b>
                            </p>
                        </Tooltip>
                    </Surface>
                )}
                {level.ID > 3 && (
                    <Surface variant='600'>
                        <p>ID</p>
                        <IDButton className='font-bold' id={level.ID} />
                    </Surface>
                )}
            </div>
        </Surface>
    );
}
