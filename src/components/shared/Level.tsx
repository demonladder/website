import IDButton from '../ui/IDButton';
import { useNavigate } from 'react-router';
import DemonFace from './DemonFace';
import { DemonLogoSizes } from '../../utils/difficultyToImgSrc';
import YesTick from '../images/YesTick';
import { Difficulties, Rarity } from '../../features/level/types/LevelMeta';
import { IDMapper } from '../../utils/IDMapper';
import { useApp } from '../../context/app/useApp';

interface Props {
    ID: number;
    difficulty: Difficulties;
    rarity: Rarity;
    rating: number | null;
    defaultRating?: number | null;
    actualRating?: number | null;
    enjoyment: number | null;
    actualEnjoyment?: number | null;
    completed?: boolean;
    name: string;
    creator?: string | null;
    songName?: string;
    onContextMenu?: React.MouseEventHandler;
    selected?: boolean;
    position?: number;
}

export default function Level({ ID, difficulty, rarity, rating, defaultRating, actualRating, enjoyment, actualEnjoyment, name, creator, position, songName, completed = false, onContextMenu, selected = false }: Props) {
    const roundedTier = Math.round(rating ?? defaultRating ?? 0);
    const roundedEnjoyment = enjoyment !== null ? Math.round(enjoyment) : -1;

    const navigate = useNavigate();
    const app = useApp();

    return (
        <div className={'relative group cursor-pointer outline-offset-4 round:rounded-xl focus-visible:outline-2' + (selected ? ' outline-2 z-20' : '') + (app.enableLevelThumbnails ? '' : (completed ? ' odd:bg-green-700 even:bg-green-500' : ' odd:bg-theme-700 even:bg-theme-500'))} onClick={() => void navigate('/level/' + ID)} onContextMenu={onContextMenu} tabIndex={0}>
            {app.enableLevelThumbnails &&
                <img className='absolute size-full object-cover object-center transition-all opacity-60 group-hover:opacity-100 focus-visible:opacity-100 level-thumbnail' loading='lazy' src={`https://levelthumbs.prevter.me/thumbnail/${IDMapper(ID)}`} style={{ maskImage: 'linear-gradient(to right, transparent var(--mask-start-at, 40%), black 90%)' }} />
            }
            <div className='flex justify-between h-20'>
                <div className='flex gap-4 z-10 items-center'>
                    <DemonFace diff={difficulty} rarity={rarity} size={DemonLogoSizes.SMALL} />
                    <div className='flex flex-col'>
                        <p className='text-lg lg:text-[26.4px]'>
                            <b>{name}</b>
                            <br className='md:hidden' />
                            {creator && <span> by {creator}</span>}
                            {completed && app.highlightCompleted &&
                                <YesTick className='inline-block ms-2 size-6 lg:size-8' />
                            }
                        </p>
                        {position !== undefined &&
                            <p className='text-xl text-gray-400'>Queue: #{position}</p>
                        }
                    </div>
                </div>
                <div className='flex gap-4 z-10'>
                    <div className='self-center hidden lg:block'>
                        <div className='flex flex-col text-end' style={{ textShadow: '1px 2px 0px black, 0px 1px 10px black' }}>
                            {ID > 3 && <p>ID: <IDButton id={ID} style={{ textShadow: '1px 2px 0px black, 0px 1px 10px black' }} /></p>}
                            {songName && <p>song: <b>{songName}</b></p>}
                        </div>
                    </div>
                    <div className='flex text-3xl text-shadow-lg'>
                        <div className={`flex justify-center w-14 lg:w-28 tier-${roundedTier}`}><p className='group-hover:hidden self-center cursor-default'>{rating !== null ? roundedTier : (defaultRating ?? 'N/A')}</p><p className='hidden group-hover:block self-center cursor-default'>{(actualRating ?? rating)?.toFixed(2) ?? 'N/A'}</p></div>
                        <div className={`flex justify-center w-14 lg:w-28 enj-${roundedEnjoyment}`}><p className='group-hover:hidden self-center cursor-default'>{enjoyment !== null ? roundedEnjoyment : 'N/A'}</p><p className='hidden group-hover:block self-center cursor-default'>{(actualEnjoyment ?? enjoyment)?.toFixed(2) ?? 'N/A'}</p></div>
                    </div>
                </div>
            </div>
        </div>
    );
}

export function LevelSkeleton() {
    return (
        <div className='flex justify-between h-20'>
            <div className='flex gap-4 z-10 items-center'>
                <span className='size-16 bg-theme-500 rounded-full' />
                <span className='h-6 w-64 bg-theme-500 rounded shimmer' />
            </div>
            <div className='flex gap-4 z-10'>
                <div className='self-center hidden lg:block'>
                    <div className='flex flex-col gap-2' style={{ textShadow: '1px 2px 0px black, 0px 1px 10px black' }}>
                        <span className='h-4 w-20 ms-auto bg-theme-500 rounded shimmer' />
                        <span className='h-4 w-40 bg-theme-500 rounded shimmer' />
                    </div>
                </div>
                <div className='flex text-3xl text-shadow-lg'>
                    <div className={`flex justify-center w-14 lg:w-28 bg-theme-500`}></div>
                    <div className={`flex justify-center w-14 lg:w-28 bg-theme-500`}></div>
                </div>
            </div>
        </div>
    );
}
