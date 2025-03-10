import Level from './Level';
import { Reference } from '../../../api/references/getReferences';

interface Props {
    references: Reference[];
    tier: number | string;
}

export default function Tier({ references, tier }: Props) {
    return (
        <div className='flex min-h-[170px] bg-gray-800 border-b-[1px] border-gray-500'>
            <div className={`tier-label tier-${references[0].Tier} flex items-center`}>
                <p className='text-center min-w-[70px]'>Tier {tier}</p>
            </div>
            <div className='py-2 min-w-[230px]'>
                {references.map((l) => <Level level={l} key={l.ID} />)}
            </div>
        </div>
    );
}
