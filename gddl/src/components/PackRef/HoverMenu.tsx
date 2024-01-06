import { PackShell } from '../../api/packs/types/PackShell';

interface Props {
    pack: PackShell;
}

export default function HoverMenu({ pack }: Props) {
    return (
        <div className='absolute pointer-events-none opacity-0 group-hover:opacity-100 transition-all text-center top-full left-1/2 -translate-x-1/2 -translate-y-2 group-hover:translate-y-1 z-10 bg-gray-500 border border-gray-400 p-2 round:rounded-lg shadow-xl'>
            <ul>
                <li>
                    <p>{pack.LevelCount !== null ? pack.LevelCount : '0'} levels</p>
                </li>
                <li>
                    <p>Avg. enjoyment: {pack.AverageEnjoyment?.toFixed(2) || 'N/A'}</p>
                </li>
                <li>
                    <p>Median tier: {pack.MedianTier !== null ? pack.MedianTier : 'N/A'}</p>
                </li>
            </ul>
        </div>
    );
}