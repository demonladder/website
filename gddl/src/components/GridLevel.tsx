import { useNavigate } from 'react-router-dom';
import DemonLogo from './DemonLogo';
import StorageManager from '../utils/StorageManager';
import Copy from './Copy';

interface GridProps {
    ID: number;
    rating: number | null;
    enjoyment: number | null;
    proof?: string;
    name: string;
    creator: string;
    difficulty: string;
    inPack: boolean;
}

export function GridLevel({ ID, rating, enjoyment, proof, name, creator, difficulty, inPack }: GridProps) {
    const navigate = useNavigate();
    
    function handleClick() {
        navigate('/level/' + ID);
    }

    function handleProofClick(e: React.MouseEvent) {
        e.stopPropagation();
        if (!proof) return;
        
        window.open(proof.startsWith('https://') ? proof : `https://${proof}`, '_blank')
    }

    const roundedRating = rating !== null ? Math.round(rating) : 0;
    const roundedEnjoyment = enjoyment !== null ? Math.round(enjoyment) : -1;
    
    return (
        <div className={'relative cursor-pointer p-2 border border-white border-opacity-0 hover:border-opacity-100 transition-colors round:rounded-xl tier-' + roundedRating} onClick={handleClick}>
            <b className='text-xl'><Copy text={''+ID} /> {name}</b>
            <div className='flex justify-between text-lg'>
                <div>
                    <p>by {creator}</p>
                    <p className='pb-10'>Tier {rating !== null ? (<b>{roundedRating}</b>) : 'not rated'}</p>
                </div>
                <div className='basis-24 relative'>
                    <DemonLogo diff={difficulty} />
                        <div className='absolute flex text-3xl bottom-0 -left-2 -translate-x-full cursor-help'>
                            {proof &&
                                <div className='self-center px-2 cursor-pointer' onClick={handleProofClick} title='Proof of completion'>
                                    <i className='bx bx-link'></i>
                                </div>
                            }
                            {inPack &&
                                <i className='bx bx-box' title='This level is in a pack'></i>
                            }
                        </div>
                </div>
            </div>
            <div className={'absolute flex items-end bottom-[-1px] left-[-1px] w-12 h-12 enj-' + roundedEnjoyment} style={{borderRadius: StorageManager.getIsRounded() ? '0 3rem 0 0.75rem' : '0 3rem 0 0'}}>
                <b className='p-2 ps-3'>{enjoyment !== null ? roundedEnjoyment : '-'}</b>
            </div>
        </div>
    );
}