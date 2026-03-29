import { Link } from 'react-router';
import PackIcon from '../ui/PackIcon';
import HoverMenu from './HoverMenu';
import Pack from '../../features/singlePack/types/Pack';
import PackMeta from '../../features/singlePack/types/PackMeta';

interface Props {
    pack: Pick<Pack, 'ID' | 'Name' | 'IconName'>;
    meta: PackMeta | null;
    completed?: number;
}

export default function PackRef({ completed, pack, meta }: Props) {
    return (
        <Link
            to={`/pack/${pack.ID}`}
            className={`block relative group px-4 py-2 bg-theme-600 round:rounded-md border border-white/0 hover:border-white transition-colors shadow-md`}
        >
            {meta && (
                <HoverMenu
                    averageEnjoyment={meta.AverageEnjoyment}
                    levelCount={meta.LevelCount}
                    medianTier={meta.MedianTier}
                />
            )}
            <div
                className={`absolute left-0 top-0 bottom-0 round:rounded-md ${completed === meta?.LevelCount ? 'bg-green-500/75' : 'bg-green-500/20'} z-1`}
                style={{ width: `${((completed ?? 0) / (meta?.LevelCount ?? 1)) * 100}%` }}
            />
            <div className='relative z-2'>
                <PackIcon src={pack.IconName} className='inline me-4' />
                <span>{pack.Name}</span>
                <PackIcon src={pack.IconName} className='inline ms-4' />
            </div>
        </Link>
    );
}
