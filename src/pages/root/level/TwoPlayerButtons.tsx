import LevelMeta from '../../../api/types/LevelMeta';

interface Props {
    levelMeta: LevelMeta;
    showTwoPlayerStats: boolean;
    setShowTwoPlayerStats: (show: boolean) => void;
}

export default function TwoPlayerButtons({ levelMeta, showTwoPlayerStats, setShowTwoPlayerStats }: Props) {
    if (!levelMeta.IsTwoPlayer) return;

    return (
        <div className='flex items-center text-black'>
            <button className={'w-8 h-8 grid place-items-center ' + (!showTwoPlayerStats ? 'bg-gray-950 text-white' : 'bg-white')} onClick={() => setShowTwoPlayerStats(false)}>
                1P
            </button>
            <button className={'w-8 h-8 grid place-items-center ' + (showTwoPlayerStats ? 'bg-gray-950 text-white' : 'bg-white')} onClick={() => setShowTwoPlayerStats(true)}>
                2P
            </button>
        </div>
    );
}