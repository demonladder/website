import IDButton from './IDButton';
import { useNavigate } from 'react-router-dom';
import StorageManager from '../utils/StorageManager';
import Heading4 from './headings/Heading4';
import { DifficultyToImgSrc } from './DemonLogo';
import YesTick from './images/YesTick';

interface Props {
    ID: number;
    difficulty: string;
    rating: number | null;
    defaultRating?: number | null;
    actualRating?: number | null;
    enjoyment: number | null;
    actualEnjoyment?: number | null;
    completed?: boolean;
    name: string;
    creator: string;
    songName: string;
    onContextMenu?: React.MouseEventHandler;
    selected?: boolean;
}

export function Header() {
    return (
        <div className='grid grid-cols-12 font-bold ps-2 cursor-default border-b-2'>
            <Heading4 className='col-span-8 sm:col-span-8 lg:col-span-6 xl:col-span-3'>Name</Heading4>
            <Heading4 className='col-span-2 xl:col-span-2 hidden lg:inline-block self-center'>Creator</Heading4>
            <Heading4 className='col-span-3 hidden xl:block self-center'>Song</Heading4>
            <Heading4 className='col-span-2 hidden lg:flex justify-center self-center'>ID</Heading4>
            <Heading4 className='col-span-2 lg:col-span-1 flex justify-center'><p>Tier</p></Heading4>
            <Heading4 className='col-span-2 lg:col-span-1 flex justify-center'><p>Enj.</p></Heading4>
        </div>
    );
}

function IDMapper(ID: number) {
    if (ID > 3) return ID;
    if (ID === 1) return 14;
    if (ID === 2) return 18;
    if (ID === 3) return 20;
}

export default function Level({ ID, difficulty, rating, defaultRating, actualRating, enjoyment, actualEnjoyment, name, creator, songName, completed = false, onContextMenu, selected = false }: Props) {
    const roundedTier = Math.round(rating ?? defaultRating ?? 0);
    const roundedEnjoyment = enjoyment !== null ? Math.round(enjoyment) : -1;

    const tierClass = 'tier-' + roundedTier;
    const enjoymentClass = 'enj-' + roundedEnjoyment;

    const navigate = useNavigate();

    return (
        <div className={'relative group cursor-pointer outline-offset-4 round:rounded-xl focus-visible:outline-2' + (selected ? ' outline-2 z-20' : '')} onClick={() => navigate('/level/' + ID)} onContextMenu={onContextMenu} tabIndex={0}>
            <div className='absolute size-full bg-cover bg-center bg-no-repeat transition-all opacity-60 group-hover:opacity-100 focus-visible:opacity-100 level-thumbnail' style={{ backgroundImage: `url("https://levelthumbs.prevter.me/thumbnail/${IDMapper(ID)}")`, maskImage: 'linear-gradient(to right, transparent var(--mask-start-at, 40%), black 90%)' }} />
            <div className='flex justify-between h-20'>
                <div className='flex gap-4 z-10 items-center'>
                    <img src={DifficultyToImgSrc(difficulty)} alt={`${difficulty} demon face`} className='size-16' />
                    <p className='text-lg lg:text-[26.4px]'><b>{name}</b> by {creator}</p>
                    {completed && StorageManager.getHighlightCompleted() &&
                        <YesTick className='size-6 lg:size-8' />
                    }
                </div>
                <div className='flex gap-4 z-10'>
                    <div className='self-center hidden lg:block'>
                        <div className='flex flex-col text-end' style={{ textShadow: '1px 2px 0px black, 0px 1px 10px black' }}>
                            {ID > 3 && <p>ID: <IDButton id={ID} /></p>}
                            <p>song: <b>{songName}</b></p>
                        </div>
                    </div>
                    <div className='flex text-3xl text-shadow-lg'>
                        <div className={`flex justify-center w-14 lg:w-28 ${tierClass}`}><p className='group-hover:hidden self-center cursor-default'>{rating !== null ? roundedTier : (defaultRating ?? 'N/A')}</p><p className='hidden group-hover:block self-center cursor-default'>{(actualRating ?? rating)?.toFixed(2) ?? 'N/A'}</p></div>
                        <div className={`flex justify-center w-14 lg:w-28 ${enjoymentClass}`}><p className='group-hover:hidden self-center cursor-default'>{enjoyment !== null ? roundedEnjoyment : 'N/A'}</p><p className='hidden group-hover:block self-center cursor-default'>{(actualEnjoyment ?? enjoyment)?.toFixed(2) ?? 'N/A'}</p></div>
                    </div>
                </div>
            </div>
        </div>
    );
}
