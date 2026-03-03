import { Link } from 'react-router';
import DemonFace from './DemonFace';
import { DemonLogoSizes } from '../../utils/difficultyToImgSrc';
import Copy from '../ui/Copy';
import { Difficulties, Rarity } from '../../features/level/types/LevelMeta';
import { IDMapper } from '../../utils/IDMapper';
import { useApp } from '../../context/app/useApp';
import YesTick from '../images/YesTick';
import './GridLevel.css';
import { getWordLength } from '../../utils/wordLength';
import { DotsVerticalRounded } from '@boxicons/react';

interface GridProps {
    ID: number;
    rating: number | null;
    enjoyment: number | null;
    proof?: string | null;
    name: string;
    creator?: string | null;
    difficulty: Difficulties;
    rarity: Rarity;
    completed?: boolean;
    inPack?: boolean;
    date?: string;
    selected?: boolean;
    position?: number;
    onContextMenu?: (e: React.MouseEvent) => void;
}

export function GridLevel({
    ID,
    rating,
    enjoyment,
    proof,
    name,
    creator,
    difficulty,
    rarity,
    completed = false,
    inPack = false,
    date,
    selected = false,
    position,
    onContextMenu,
}: GridProps) {
    const app = useApp();

    const roundedRating = rating !== null ? Math.round(rating) : 0;
    const roundedEnjoyment = enjoyment !== null ? Math.round(enjoyment) : -1;

    const longestWordInNameLength = name.split(' ').reduce((max, word) => Math.max(max, getWordLength(word)), 0);
    const classes = longestWordInNameLength > 27 ? 'break-all' : 'break-words';

    return (
        <div
            className={'grid-level relative group min-h-40 round:rounded-xl' + (selected ? ' outline' : '')}
            onContextMenu={onContextMenu}
            style={{
                backgroundImage: app.enableLevelThumbnails
                    ? `linear-gradient(rgba(0, 0, 0, var(--image-opacity)), rgba(0, 0, 0, var(--image-opacity))), url("https://levelthumbs.prevter.me/thumbnail/${IDMapper(ID)}")`
                    : undefined,
            }}
        >
            <div
                className={
                    'p-2 ' +
                    (app.enableLevelThumbnails
                        ? 'text-white'
                        : 'text-theme-text round:rounded-xl ' +
                          (completed && app.highlightCompleted
                              ? 'bg-gradient-to-br from-green-600 via-green-500 to-green-600'
                              : 'bg-theme-600'))
                }
            >
                <div className='relative flex justify-between'>
                    <div>
                        <p>
                            <b
                                className={
                                    'text-xl text-shadow-lg ' +
                                    classes +
                                    (completed && app.highlightCompleted && app.enableLevelThumbnails
                                        ? ' text-green-400 text-shadow-green-200/20'
                                        : '')
                                }
                            >
                                <Copy text={ID.toString()} /> <Link to={'/level/' + ID}>{name}</Link>
                            </b>
                            {completed && app.highlightCompleted && (
                                <YesTick className='inline-block ms-1 mb-1 size-6' />
                            )}
                        </p>
                        {creator !== undefined && <p>by {creator ?? '(-)'}</p>}
                        {position !== undefined && <p>#{position}</p>}
                    </div>
                    <div className='self-center'>
                        <DemonFace diff={difficulty} rarity={rarity} size={DemonLogoSizes.MEDIUM} />
                    </div>
                    {onContextMenu && (
                        <div className='absolute right-0 top-0'>
                            <button
                                className='block hover:bg-white/20 transition-colors rounded-full float-right'
                                onClick={onContextMenu}
                            >
                                <DotsVerticalRounded pack='filled' />
                            </button>
                        </div>
                    )}
                </div>
                <div className='flex justify-between'>
                    <div className='flex gap-1'>
                        <p>
                            <b className={`px-2 py-1 text-xl shadow rounded tier-${roundedRating}`}>
                                {rating?.toFixed() ?? '-'}
                            </b>
                        </p>
                        <p>
                            <b className={`px-2 py-1 text-xl shadow rounded enj-${roundedEnjoyment}`}>
                                {enjoyment?.toFixed() ?? '-'}
                            </b>
                        </p>
                        {proof && (
                            <a href={proof} target='_blank' rel='noreferrer'>
                                <i
                                    className='bx bxl-youtube p-1 cursor-pointer rounded transition-colors hover:bg-theme-500 text-xl'
                                    title='Showcase of the level'
                                />
                            </a>
                        )}
                        {inPack && <i className='bx bx-box text-2xl p-1' title='This level is in a pack' />}
                    </div>
                    {date && (
                        <p className='text-shadow'>
                            {new Date(date.replace(' +00:00', 'Z').replace(' ', 'T')).toLocaleDateString()}
                        </p>
                    )}
                </div>
            </div>
            <div></div>
        </div>
    );
}
