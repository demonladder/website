import { Link } from 'react-router';
import { Reference } from '../api/getReferences';

export default function Level({ level }: { level: Reference }) {
    return (
        <div className='px-2 level-label h-1/5'>
            <Link to={`/level/${level.LevelID}`} className='m-0 underline'>{level.Level.Meta.Name}</Link>
        </div>
    );
}
