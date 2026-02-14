import LevelMeta from '../types/LevelMeta';

interface Props {
    levelMeta: LevelMeta;
    showTwoPlayerStats: boolean;
    setShowTwoPlayerStats: (show: boolean) => void;
}

export default function TwoPlayerButtons({ levelMeta, showTwoPlayerStats, setShowTwoPlayerStats }: Props) {
    if (!levelMeta.IsTwoPlayer) return;

    return (
        <div className='p-1 bg-theme-900/60 round:rounded-md inline-block'>
            <button
                className={
                    'w-8 h-8 round:rounded-md transition-colors ' +
                    (!showTwoPlayerStats ? 'bg-theme-500 hover:bg-theme-500/80' : 'hover:bg-theme-900/40')
                }
                onClick={() => setShowTwoPlayerStats(false)}
            >
                1P
            </button>
            <button
                className={
                    'w-8 h-8 round:rounded-md transition-colors ' +
                    (showTwoPlayerStats ? 'bg-theme-500 hover:bg-theme-500/80' : 'hover:bg-theme-900/40')
                }
                onClick={() => setShowTwoPlayerStats(true)}
            >
                2P
            </button>
        </div>
    );
}
