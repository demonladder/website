import { useQuery } from '@tanstack/react-query';
import { Heading2 } from '../../../components/headings';
import Surface from '../../../components/layout/Surface';
import { getSupporters } from '../api/getSupporters';
import { Link } from 'react-router';

function Supporter({ supporter }: { supporter: { ID: number; name: string } }) {
    return (
        <li>
            <p className='text-xl px-2 py-1 text-yellow-400 bg-theme-700 rounded'>
                <b>
                    <Link to={`/profile/${supporter.ID}`}>{supporter.name}</Link>
                </b>
            </p>
        </li>
    );
}

export default function Supporters() {
    const { data: supporters, status } = useQuery({
        queryKey: ['supporters'],
        queryFn: getSupporters,
    });

    return (
        <Surface variant='800' size='xl'>
            <Heading2 className='mb-4 text-center'>Supporters</Heading2>
            {status === 'success' && (
                <ul className='flex flex-wrap gap-2 overflow-y-auto max-h-[400px]' style={{ scrollbarWidth: 'thin' }}>
                    {supporters.map((supporter) => (
                        <Supporter supporter={supporter} key={supporter.ID} />
                    ))}
                </ul>
            )}
        </Surface>
    );
}
