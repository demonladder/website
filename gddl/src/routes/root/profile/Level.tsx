import { Submission } from '../../../api/submissions';
import { Link, useNavigate } from 'react-router-dom';
import DemonLogo from '../../../components/DemonLogo';

type Props = {
    isHeader: boolean,
    info?: Submission,
}

export default function Level({ info, isHeader }: Props) {
    if (isHeader || !info) {
        return (
            <div className='grid grid-cols-12 font-bold text-2xl ps-2 border-b-2'>
                <h3 className='col-span-8 md:col-span-6'>Level Name</h3>
                <div className='col-span-4 hidden md:block'><h3>Creator</h3></div>
                <div className='col-span-2 md:col-span-1 text-center'><h3>Tier</h3></div>
                <div className='col-span-2 md:col-span-1 text-center'><h3>Enj</h3></div>
            </div>
        );
    }

    const userRating = info.Rating ? info.Rating : '-';
    const userEnjoyment = info.Enjoyment !== null ? (info.Enjoyment === -1 ? '-' : info.Enjoyment) : '-';
    
    return (
        <div className='grid grid-cols-12 text-xl ps-2 h-12'>
            <h4 className='col-span-8 md:col-span-6 self-center'><Link to={'/level/' + info.LevelID} className='underline'>{info.Name}</Link></h4>
            <p className='col-span-4 hidden md:block self-center'>{info.Creator}</p>
            <div className={'col-span-2 md:col-span-1 flex justify-center tier-' + userRating}><p className='self-center'>{userRating}</p></div>
            <div className={'col-span-2 md:col-span-1 flex justify-center enj-' + userEnjoyment}><p className='self-center'>{userEnjoyment}</p></div>
        </div>
    );
}

export function Grid({ info }: { info: Submission }) {
    const navigate = useNavigate();
    function handleClick() {
        navigate('/level/' + info.LevelID);
    }

    const userRating = info.Rating !== null ? info.Rating : 0;
    const userEnjoyment = info.Enjoyment !== null ? info.Enjoyment : -1;
    
    return (
        <div className={'relative cursor-pointer p-2 pb-10 tier-' + userRating} onClick={handleClick}>
            <b className='text-xl'>{info.Name}</b>
            <div className='flex justify-between text-lg'>
                <div>
                    <p>by {info.Creator}</p>
                    <p>Tier {info.Rating !== null ? userRating : 'not rated'}</p>
                </div>
                <img className='max-w-[96px]' src={DemonLogo(info.Difficulty)} />
            </div>
            <div className={'absolute flex items-end bottom-0 left-0 w-12 h-12 rounded-tr-full enj-' + userEnjoyment}>
                <p className='p-2'>{info.Enjoyment !== null ? userEnjoyment : '-'}</p>
            </div>
        </div>
    );
}