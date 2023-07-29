import IDButton from '../../../../components/IDButton';
import { Link } from 'react-router-dom';
import { PackLevel } from '../../../../api/packs';

type Props = {
    isHeader?: boolean,
    info: PackLevel,
}

function Header() {
    return (
        <div className='grid grid-cols-12 ps-2 font-bold text-2xl border-b-2'>
            <h3 className='col-span-10 md:col-span-7 lg:col-span-6 xl:col-span-4 self-center'>Level Name</h3>
            <h3 className='col-span-3 xl:col-span-2 hidden md:inline-block self-center'>Creator</h3>
            <h3 className='col-span-3 hidden xl:block self-center'>Song</h3>
            <h3 className='col-span-2 xl:col-span-2 hidden lg:block self-center'>ID</h3>
            <h3 className='col-span-2 lg:col-span-1 flex justify-center'><p className='align-self-center'>Tier</p></h3>
        </div>
    );
}

function Level({ info }: Props) {
    const roundedTier = Math.round(info.Rating);

    return (
        <div className='grid grid-cols-12 h-12 ps-2 text-xl'>
            <h4 className='col-span-10 md:col-span-7 lg:col-span-6 xl:col-span-4 self-center'>
                <Link to={'/level/' + info.LevelID} className='underline'>{info.Name}</Link>
            </h4>

            <div className='col-span-3 xl:col-span-2 hidden md:inline-block self-center'><p>{info.Creator}</p></div>
            <div className='col-span-3 hidden xl:block self-center'><p>{info.Song}</p></div>
            <div className='col-span-2 xl:col-span-2 hidden lg:block self-center'><IDButton className='id-button underline' id={info.LevelID} /></div>
            <div className={`col-span-2 lg:col-span-1 flex justify-center tier-${roundedTier}`}><p className='self-center'>{roundedTier}</p></div>
        </div>
    );
}

export default Object.assign(Level, {
    Header,
});