import DemonLogo from '../../../components/DemonLogo';
import IDButton from '../../../components/IDButton';
import { Level as TLevel } from '../../../api/levels';
import { Link, useNavigate } from 'react-router-dom';

type Props = {
    isHeader?: boolean,
    info: TLevel,
}

function Header() {
    return (
        <div className='grid grid-cols-12 font-bold text-2xl ps-2 cursor-default border-b-2'>
            <h4 className='col-span-10 sm:col-span-7 lg:col-span-6 xl:col-span-4'>Level Name</h4>
            <h4 className='col-span-3 xl:col-span-2 hidden sm:inline-block self-center'>Creator</h4>
            <h4 className='col-span-3 hidden xl:block self-center'>Song</h4>
            <h4 className='col-span-2 hidden lg:flex justify-center self-center'>ID</h4>
            <h4 className='col-span-2 lg:col-span-1 flex justify-center'><p>Tier</p></h4>
        </div>
    );
}

function Grid({ info }: Props) {
    const navigate = useNavigate();
    function handleClick() {
        navigate('/level/' + info.ID);
    }

    const roundedTier = Math.round(info.Rating);
    const roundedEnjoyment = Math.round(info.Enjoyment);
    return (
        <div className={`p-2 cursor-pointer select-none tier-${roundedTier}`} onClick={handleClick}>
            <h1 className='text-break font-bold text-lg'>{info.Name}</h1>
            <div className='flex justify-between'>
                <div>
                    <h3 className='created-by'>by {info.Creator}</h3>
                    { roundedTier !== 0 ?
                        <h3>Tier <b>{roundedTier}</b></h3> :
                        <h3>Unrated</h3>
                    }
                    { roundedTier !== 0 ?
                        <h3>Enjoyment <b>{roundedEnjoyment}</b></h3> :
                        <h3>Enjoyment -</h3>
                    }
                </div>
                <img className='max-w-[96px]' src={DemonLogo(info.Difficulty)} alt='' />
            </div>
        </div>
    );
}

function Level({ info }: Props) {
    const roundedTier = Math.round(info.Rating) || '-';
    const tierClass = 'tier-' + Math.round(info.Rating);

    return (
        <div className='grid grid-cols-12 ps-2 h-12 text-xl'>
            <h4 className='col-span-10 sm:col-span-7 lg:col-span-6 xl:col-span-4 self-center'>
                <Link to={'/level/' + info.ID} className='underline text-break'>{info.Name}</Link>
            </h4>

            <div className='col-span-3 xl:col-span-2 hidden sm:inline-block self-center'><p className='cursor-default'>{info.Creator}</p></div>
            <div className='col-span-3 hidden xl:block self-center'><p className='cursor-default'>{info.Song}</p></div>
            <div className='col-span-2 hidden lg:flex justify-center self-center'><IDButton className='id-button underline-p' id={info.ID} /></div>
            <div className={`col-span-2 lg:col-span-1 flex justify-center ${tierClass}`}><p className='self-center cursor-default'>{roundedTier}</p></div>
        </div>
    );
}

export default Object.assign(Level, {
    Header,
    Grid,
});