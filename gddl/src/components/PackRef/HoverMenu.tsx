import PackMeta from '../../api/types/PackMeta';

interface Props {
    averageEnjoyment: PackMeta['AverageEnjoyment'];
    levelCount: PackMeta['LevelCount'];
    medianTier: PackMeta['MedianTier'];
}

export default function HoverMenu({ averageEnjoyment, levelCount, medianTier }: Props) {
    return (
        <div className='absolute pointer-events-none opacity-0 group-hover:opacity-100 transition-all text-center top-full left-1/2 -translate-x-1/2 -translate-y-2 group-hover:translate-y-1 z-10 bg-gray-500 border border-gray-400 p-2 round:rounded-lg shadow-xl'>
            <ul>
                <li>
                    <p>{levelCount} levels</p>
                </li>
                <li>
                    <p>Avg. enjoyment: {averageEnjoyment?.toFixed(2) ?? 'N/A'}</p>
                </li>
                <li>
                    <p>Median tier: {medianTier ?? 'N/A'}</p>
                </li>
            </ul>
        </div>
    );
}