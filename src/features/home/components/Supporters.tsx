import { useQuery } from '@tanstack/react-query';
import Heading2 from '../../../components/headings/Heading2';
import Surface from '../../../components/Surface';
import { getSupporters } from '../api/getSupporters';

function Supporter({ supporter, rank }: { supporter: { fromName: string, displayAmount: string }, rank: number }) {
    let classNames = 'mt-2 me-2';

    classNames += {
        1: ' text-amber-400 text-3xl',
        2: ' text-neutral-400 text-2xl',
        3: ' text-orange-400 text-xl mb-4',
        4: '',
    }[Math.min(rank, 4)];

    return (
        <li className={classNames}>
            <div className='flex justify-between'>
                <p>#{rank} <b>{supporter.fromName}</b></p>
                <p>{supporter.displayAmount}</p>
            </div>
        </li>
    );
}

export default function Supporters() {
    const { data: supporters, status } = useQuery({
        queryKey: ['supporters'],
        queryFn: getSupporters,
    });

    return (
        <Surface variant='800'>
            <Heading2 className='mb-4 text-center'>Supporters</Heading2>
            {status === 'success' &&
                <ul className='overflow-y-auto max-h-[400px]' style={{ scrollbarWidth: 'thin' }}>
                    {supporters.map((supporter, i) => (
                        <Supporter supporter={supporter} rank={i + 1} key={supporter.fromName} />
                    ))}
                </ul>
            }
        </Surface>
    );
}
