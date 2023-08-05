import { useNavigate } from "react-router-dom";
import DemonLogo from "./DemonLogo";
import { StorageManager } from "../storageManager";
import Copy from "./Copy";

interface GridProps {
    info: {
        LevelID: number,
        Name: string,
        Creator: string,
        Difficulty: string,
        Rating: number|null,
        Enjoyment: number|null,
    }
}

export function GridLevel({ info }: GridProps) {
    const navigate = useNavigate();
    function handleClick() {
        navigate('/level/' + info.LevelID);
    }

    const rating = info.Rating !== null ? Math.round(info.Rating) : 0;
    const enjoyment = info.Enjoyment !== null ? Math.round(info.Enjoyment) : -1;
    
    return (
        <div className={'relative cursor-pointer p-2 pb-10 border border-white border-opacity-0 hover:border-opacity-100 transition-colors round:rounded-xl tier-' + rating} onClick={handleClick}>
            <b className='text-xl'><Copy text={''+info.LevelID} /> {info.Name}</b>
            <div className='flex justify-between text-lg'>
                <div>
                    <p>by {info.Creator}</p>
                    <p>Tier {info.Rating !== null ? (<b>{rating}</b>) : 'not rated'}</p>
                </div>
                <img className='max-w-[96px]' src={DemonLogo(info.Difficulty)} />
            </div>
            <div className={'absolute flex items-end bottom-[-1px] left-[-1px] w-12 h-12 enj-' + enjoyment} style={{borderRadius: StorageManager.getIsRounded() ? '0 3rem 0 0.75rem' : '0 3rem 0 0'}}>
                <b className='p-2 ps-3'>{info.Enjoyment !== null ? enjoyment : '-'}</b>
            </div>
        </div>
    );
}