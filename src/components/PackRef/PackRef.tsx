import { Link } from 'react-router';
import PackIcon from '../PackIcon';
import HoverMenu from './HoverMenu';
import Pack from '../../features/singlePack/types/Pack';
import PackMeta from '../../features/singlePack/types/PackMeta';
import useSession from '../../hooks/useSession';

interface Props {
    pack: Pack;
    meta: PackMeta | null;
}

export default function PackRef({ pack, meta }: Props) {
    const session = useSession();
    const isCompleted = session.user?.CompletedPacks.find((p) => p.PackID === pack.ID);

    return (
        <Link to={`/pack/${pack.ID}`} className={`block relative group px-4 py-2 ${isCompleted ? 'bg-green-700' : 'bg-theme-500'} round:rounded-md border border-white/0 hover:border-white/100 transition-colors shadow-md`}>
            {meta &&
                <HoverMenu averageEnjoyment={meta.AverageEnjoyment} levelCount={meta.LevelCount} medianTier={meta.MedianTier} />
            }
            <PackIcon pack={pack} className='inline me-4' />
            {pack.Name}
            <PackIcon pack={pack} className='inline ms-4' />
        </Link>
    );
}
