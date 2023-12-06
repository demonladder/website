import IDButton from './IDButton';
import { Level as TLevel } from '../api/levels';
import { Link } from 'react-router-dom';
import StorageManager from '../utils/StorageManager';

type Props = {
    isHeader?: boolean,
    info: TLevel & {
        ActualRating?: number;
        ActualEnjoyment?: number;
    },
    onContextMenu?: React.MouseEventHandler;
}

function Header() {
    return (
        <div className='grid grid-cols-12 font-bold text-2xl ps-2 cursor-default border-b-2'>
            <h4 className='col-span-8 sm:col-span-8 lg:col-span-6 xl:col-span-3'>Level Name</h4>
            <h4 className='col-span-2 xl:col-span-2 hidden lg:inline-block self-center'>Creator</h4>
            <h4 className='col-span-3 hidden xl:block self-center'>Song</h4>
            <h4 className='col-span-2 hidden lg:flex justify-center self-center'>ID</h4>
            <h4 className='col-span-2 lg:col-span-1 flex justify-center'><p>Tier</p></h4>
            <h4 className='col-span-2 lg:col-span-1 flex justify-center'><p>Enj.</p></h4>
        </div>
    );
}

function Level({ info, onContextMenu }: Props) {
    const roundedTier = info.Rating !== null ? Math.round(info.Rating) : 0;
    const roundedEnjoyment = info.Enjoyment !== null ? Math.round(info.Enjoyment) : -1;
    
    const tierClass = 'tier-' + roundedTier;
    const enjoymentClass = 'enj-' + roundedEnjoyment;
    const completed = info.Completed === 1;

    return (
        <div className={'grid grid-cols-12 ps-2 min-h-[48px] text-xl' + ((completed && StorageManager.getHighlightCompleted()) ? ' bg-green-700 font-bold' : ' bg-gray-700')} onContextMenu={onContextMenu}>
            <h4 className='col-span-8 sm:col-span-8 lg:col-span-6 xl:col-span-3 self-center flex'>
                {completed && StorageManager.getHighlightCompleted() &&
                    <img src='/assets/images/yes tick.webp' className='w-8 h-8 self-center me-2' alt='' />
                }
                <Link to={'/level/' + info.LevelID} className='self-center underline break-all whitespace-pre-wrap'>{info.Name}</Link>
            </h4>

            <div className='col-span-2 xl:col-span-2 hidden lg:inline-block self-center'><p className='cursor-default'>{info.Creator}</p></div>
            <div className='col-span-3 hidden xl:block self-center'><p className='cursor-default'>{info.Song}</p></div>
            <div className='col-span-2 hidden lg:flex justify-center self-center'><IDButton id={info.LevelID} /></div>
            <div className={`group col-span-2 lg:col-span-1 flex justify-center ${tierClass}`}><p className='group-hover:hidden self-center cursor-default'>{info.Rating !== null ? roundedTier : 'N/A'}</p><p className='hidden group-hover:block self-center cursor-default'>{info.Rating !== null ? (info.ActualRating || info.Rating).toFixed(2) : 'N/A'}</p></div>
            <div className={`group col-span-2 lg:col-span-1 flex justify-center ${enjoymentClass}`}><p className='group-hover:hidden self-center cursor-default'>{info.Enjoyment !== null ? roundedEnjoyment : 'N/A'}</p><p className='hidden group-hover:block self-center cursor-default'>{info.Enjoyment !== null ? (info.ActualEnjoyment !== undefined ? info.ActualEnjoyment : info.Enjoyment).toFixed(2) : 'N/A'}</p></div>
        </div>
    );
}

export default Object.assign(Level, {
    Header,
});