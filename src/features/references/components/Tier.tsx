import Level from './Level';
import { Reference } from '../api/getReferences';
import { Link } from 'react-router';

interface Props {
    references: Reference[];
    tier: number | string;
}

export default function Tier({ references, tier }: Props) {
    function onTierClicked() {
        sessionStorage.setItem('level-filters', JSON.stringify({ minRating: tier, maxRating: tier }));
    }

    return (
        <div className='flex min-h-[170px] bg-theme-800 border-b-[1px] border-theme-500'>
            <div className={`tier-label tier-${references[0].Tier} flex items-center`}>
                <Link to='/search' onClick={onTierClicked} className='text-center min-w-[70px]'>
                    <span className='underline'>Tier {tier}</span>
                </Link>
            </div>
            <div className='py-2 min-w-[230px]'>
                {references.map((l) => (
                    <Level level={l} key={l.LevelID} />
                ))}
            </div>
        </div>
    );
}
