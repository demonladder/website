import { useNavigate } from 'react-router-dom';
import DemonFace from './DemonFace';
import { DemonLogoSizes } from '../utils/difficultyToImgSrc';
import Copy from './Copy';
import { Difficulties, Rarity } from '../features/level/types/LevelMeta';
import { IDMapper } from '../utils/IDMapper';
import { useApp } from '../context/app/useApp';
import YesTick from './images/YesTick';

interface GridProps {
    ID: number;
    rating: number | null;
    enjoyment: number | null;
    proof?: string | null;
    name: string;
    creator: string;
    difficulty: Difficulties;
    rarity: Rarity;
    completed?: boolean;
    inPack: boolean;
    onContextMenu?: (e: React.MouseEvent) => void;
}

export function GridLevel({ ID, rating, enjoyment, proof, name, creator, difficulty, rarity, completed = false, inPack, onContextMenu }: GridProps) {
    const navigate = useNavigate();
    const app = useApp();

    function handleClick() {
        navigate(`/level/${ID}`);
    }

    function handleProofClick(e: React.MouseEvent) {
        e.stopPropagation();
        if (!proof) return;

        window.open(proof.startsWith('https://') ? proof : `https://${proof}`, '_blank');
    }

    const roundedRating = rating !== null ? Math.round(rating) : 0;
    const roundedEnjoyment = enjoyment !== null ? Math.round(enjoyment) : -1;

    return (
        <div className='relative group cursor-pointer' onClick={handleClick} onContextMenu={onContextMenu}>
            {app.enableLevelThumbnails &&
                <img className='absolute size-full inset-0 object-cover round:rounded-xl object-center transition-all opacity-40 group-hover:opacity-80 focus-visible:opacity-80 level-thumbnail' src={`https://levelthumbs.prevter.me/thumbnail/${IDMapper(ID)}`} loading='lazy' />
            }
            <div className={'flex justify-between min-h-40' + (app.enableLevelThumbnails ? '' : (' round:rounded-xl ' + (completed && app.highlightCompleted ? 'bg-gradient-to-br from-green-600 via-green-500 to-green-600' : 'bg-theme-600')))}>
                <div className='z-10 p-2 flex flex-col gap-2 justify-between'>
                    <div>
                        <p><b className={'text-xl text-shadow-lg' + (completed && app.highlightCompleted ? ' text-green-400 text-shadow-green-200/20' : '')}><Copy text={ID.toString()} /> {name}</b>
                            {completed && app.highlightCompleted &&
                                <YesTick className='inline-block ms-1 mb-1 size-6' />
                            }
                        </p>
                        <p>by {creator}</p>
                    </div>
                    <div className='flex gap-1 items-center'>
                        <p><b className={`px-2 py-1 text-xl shadow rounded tier-${roundedRating}`}>{rating?.toFixed() ?? '-'}</b></p>
                        <p><b className={`px-2 py-1 text-xl shadow rounded enj-${roundedEnjoyment}`}>{enjoyment?.toFixed() ?? '-'}</b></p>
                        {proof &&
                            <i className='bx bx-link p-1 cursor-pointer rounded transition-colors hover:bg-theme-500 text-xl' onClick={handleProofClick} title='Proof of completion' />
                        }
                        {inPack &&
                            <i className='bx bx-box text-2xl p-1' title='This level is in a pack' />
                        }
                    </div>
                </div>
                <div className='self-center'>
                    <DemonFace diff={difficulty} rarity={rarity} size={DemonLogoSizes.MEDIUM} />
                </div>
            </div>
        </div>
    );
}
