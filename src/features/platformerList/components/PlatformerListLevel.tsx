import { Link } from 'react-router';
import DemonFace from '../../../components/DemonFace';
import IDButton from '../../../components/IDButton';
import { ListEntry } from '../api/getPlatformerList';

export function PlatformerListLevel({ level }: { level: ListEntry; }) {
    const roundedEnjoyment = level.Level.Enjoyment?.toFixed() ?? '-1';

    return (
        <div className='grid grid-cols-12 max-xl:gap-2'>
            <div className='self-center text-center col-span-1'>
                <b className='lg:text-6xl'>{level.Position}.</b>
            </div>
            <div className='col-span-11 flex grow gap-2 lg:gap-6 bg-gray-700'>
                <div className='w-3/12 lg:w-1/12 p-2 self-center'>
                    <DemonFace diff={level.Level.Meta.Difficulty} />
                </div>
                <div className='self-center text-sm lg:text-xl'>
                    <Link to={'/level/' + level.LevelID} className='font-bold underline break-all whitespace-pre-wrap'>{level.Level.Meta.Name}</Link>
                    <p><i>{level.Level.Meta.Publisher.name}</i></p>
                    <IDButton id={level.LevelID} />
                </div>
                <div className={`ms-auto w-10 lg:w-32 lg:h-32 grid place-items-center group enj-${roundedEnjoyment}`}>
                    <p className='text-3xl group-hover:hidden '>{level.Level.Enjoyment?.toFixed() ?? 'N/A'}</p>
                    <p className='text-3xl hidden group-hover:block '>{level.Level.Enjoyment?.toFixed(2) ?? 'N/A'}</p>
                </div>
            </div>
        </div>
    );
}
