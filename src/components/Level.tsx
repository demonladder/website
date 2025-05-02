import IDButton from './IDButton';
import { Link } from 'react-router-dom';
import StorageManager from '../utils/StorageManager';
import Heading4 from './headings/Heading4';

interface Props {
    ID: number;
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
}

function Header() {
    return (
        <div className='grid grid-cols-12 font-bold ps-2 cursor-default border-b-2'>
            <Heading4 className='col-span-8 sm:col-span-8 lg:col-span-6 xl:col-span-3'>Level Name</Heading4>
            <Heading4 className='col-span-2 xl:col-span-2 hidden lg:inline-block self-center'>Creator</Heading4>
            <Heading4 className='col-span-3 hidden xl:block self-center'>Song</Heading4>
            <Heading4 className='col-span-2 hidden lg:flex justify-center self-center'>ID</Heading4>
            <Heading4 className='col-span-2 lg:col-span-1 flex justify-center'><p>Tier</p></Heading4>
            <Heading4 className='col-span-2 lg:col-span-1 flex justify-center'><p>Enj.</p></Heading4>
        </div>
    );
}

function Level({ ID, rating, defaultRating, actualRating, enjoyment, actualEnjoyment, name, creator, songName, completed = false, onContextMenu }: Props) {
    const roundedTier = Math.round(rating ?? defaultRating ?? 0);
    const roundedEnjoyment = enjoyment !== null ? Math.round(enjoyment) : -1;

    const tierClass = 'tier-' + roundedTier;
    const enjoymentClass = 'enj-' + roundedEnjoyment;

    return (
        <div className={'grid grid-cols-12 ps-2 min-h-[48px] text-xl ' + ((completed && StorageManager.getHighlightCompleted()) ? 'bg-green-700 even:bg-green-700/60 font-bold' : 'bg-theme-700 even:bg-theme-700/40')} onContextMenu={onContextMenu}>
            <h4 className='col-span-8 sm:col-span-8 lg:col-span-6 xl:col-span-3 self-center flex'>
                {completed && StorageManager.getHighlightCompleted() &&
                    <img src='/assets/images/yes tick.webp' className='max-md:w-6 max-md:h-6 w-8 h-8 self-center me-2' alt='' />
                }
                <Link to={'/level/' + ID} className='self-center underline break-all whitespace-pre-wrap max-md:text-sm'>{name}</Link>
            </h4>

            <div className='col-span-2 xl:col-span-2 hidden lg:inline-block self-center'><p className='cursor-default'>{creator}</p></div>
            <div className='col-span-3 hidden xl:block self-center'><p className='cursor-default'>{songName}</p></div>
            <div className='col-span-2 hidden lg:flex justify-center self-center'><IDButton id={ID} /></div>
            <div className={`group col-span-2 lg:col-span-1 flex justify-center ${tierClass}`}><p className='group-hover:hidden self-center cursor-default'>{rating !== null ? roundedTier : (defaultRating ?? 'N/A')}</p><p className='hidden group-hover:block self-center cursor-default'>{(actualRating ?? rating)?.toFixed(2) ?? 'N/A'}</p></div>
            <div className={`group col-span-2 lg:col-span-1 flex justify-center ${enjoymentClass}`}><p className='group-hover:hidden self-center cursor-default'>{enjoyment !== null ? roundedEnjoyment : 'N/A'}</p><p className='hidden group-hover:block self-center cursor-default'>{(actualEnjoyment ?? enjoyment)?.toFixed(2) ?? 'N/A'}</p></div>
        </div>
    );
}

export default Object.assign(Level, {
    Header,
});
