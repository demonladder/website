import { Link } from 'react-router-dom';
import { PackShell } from '../api/packs';

export default function PackRef({ pack }: {pack: PackShell}) {
    return (
        <Link to={`/pack/${pack.ID}`} className='px-4 py-2 bg-gray-500 block hover:-translate-y-1 transition-transform'>{pack.Name}</Link>
    );
}