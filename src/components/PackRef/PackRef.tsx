import { Link } from 'react-router-dom';
import PackIcon from '../PackIcon';
import HoverMenu from './HoverMenu';
import Pack from '../../api/types/Pack';
import PackMeta from '../../api/types/PackMeta';

interface Props {
    pack: Pack;
    meta: PackMeta | null;
    completed?: boolean;
}

export default function PackRef({ pack, meta, completed = false }: Props) {
    return (
        <Link to={`/pack/${pack.ID}`} className={'block relative group px-4 py-2 ' + (completed ? 'bg-green-700' : 'bg-gray-500') + ' round:rounded-md border border-white/0 hover:border-white/100 transition-colors'}>
            {meta !== null &&
                <HoverMenu averageEnjoyment={meta.AverageEnjoyment} levelCount={meta.LevelCount} medianTier={meta.MedianTier} />
            }
            <PackIcon pack={pack} className='inline me-4' />
            {pack.Name}
            <PackIcon pack={pack} className='inline ms-4' />
        </Link>
    );
}