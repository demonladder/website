import { Link } from 'react-router-dom';
import { PackShell } from '../api/packs';

export default function PackRef({ pack }: {pack: PackShell}) {
    return (
        <Link to={`/pack/${pack.ID}`} className='px-4 py-2 bg-gray-500 round:rounded-md border border-white border-opacity-0 hover:border-opacity-100 block transition-colors'>{pack.Name}</Link>
    );
}