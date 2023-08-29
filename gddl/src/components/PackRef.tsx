import { Link } from 'react-router-dom';
import { PackShell } from '../api/packs';
import PackIcon from './PackIcon';

export default function PackRef({ pack }: { pack: PackShell }) {
    return (
        <Link to={`/pack/${pack.ID}`} className='block px-4 py-2 bg-gray-500 round:rounded-md border border-white border-opacity-0 hover:border-opacity-100 transition-colors'>
            <PackIcon pack={pack} className='inline me-4' />
            {pack.Name}
            <PackIcon pack={pack} className='inline ms-4' />
        </Link>
    );
}