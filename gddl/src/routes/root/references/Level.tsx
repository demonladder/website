import { Link } from 'react-router-dom';
import { Reference } from '../../../api/references';

export default function Level({ level }: {level: Reference}) {
    return (
        <div className='px-2 level-label'>
            <Link to={'/level/' + level.ID} className='m-0 underline'>{level.Name}</Link>
        </div>
    );
}