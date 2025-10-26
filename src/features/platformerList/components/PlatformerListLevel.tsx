import { Link } from 'react-router';
import DemonFace from '../../../components/DemonFace';
import IDButton from '../../../components/IDButton';
import { ListEntry } from '../api/getPlatformerList';
import { DemonLogoSizes } from '../../../utils/difficultyToImgSrc';

export function PlatformerListLevel({ level }: { level: ListEntry; }) {
    const roundedEnjoyment = level.Level.Enjoyment?.toFixed() ?? '-1';

    return (
        <div className='grid grid-cols-12 max-xl:gap-2'>
            <div className='self-center text-center col-span-1'>
                <b className='lg:text-6xl'>{level.Position}.</b>
            </div>
            <div className='col-span-11 flex grow gap-2 lg:gap-6 bg-theme-700'>
                <DemonFace diff={level.Level.Meta.Difficulty} size={DemonLogoSizes.MEDIUM} />
                <div className='self-center text-sm lg:text-xl'>
                    <Link to={'/level/' + level.LevelID} className='font-bold underline break-all whitespace-pre-wrap'>{level.Level.Meta.Name}</Link>
                    <p><i>{level.Level.Meta.Publisher.name}</i></p>
                    <IDButton id={level.LevelID} />
                </div>
                <div className={`ms-auto w-10 lg:w-32 lg:h-32 flex flex-col justify-center group enj-${roundedEnjoyment}`}>
                    <p className='text-center'>Tier</p>
                    <p className='text-5xl text-center group-hover:hidden '>{level.Level.Enjoyment?.toFixed() ?? 'N/A'}</p>
                    <p className='text-5xl text-center hidden group-hover:block '>{level.Level.Enjoyment?.toFixed(2) ?? 'N/A'}</p>
                </div>
            </div>
        </div>
    );
}
