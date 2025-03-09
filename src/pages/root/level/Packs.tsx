import { useQuery } from '@tanstack/react-query';
import GetLevelPacks from '../../../api/level/GetLevelPacks';
import PackRef from '../../../components/PackRef/PackRef';
import InlineLoadingSpinner from '../../../components/InlineLoadingSpinner';

type Props = {
    levelID: number,
}

export default function Packs({ levelID }: Props) {
    const { data: packs, status } = useQuery({
        queryKey: ['level', levelID, 'packs'],
        queryFn: () => GetLevelPacks(levelID),
    });

    if (status === 'loading') {
        return (
            <section className='mt-6 text-3xl'>
                <h2 className=''>Packs</h2>
                <InlineLoadingSpinner />
            </section>
        );
    } else if (status === 'error') return;

    return (
        <section className='mt-6'>
            <h2 className='text-3xl'>Packs</h2>
            {packs?.length === 0 && <p className='mb-0'>This level is not part of any packs</p>}
            <div className='grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-2 text-center max-md:text-sm'>
                {packs?.map((p) => <PackRef pack={p.Pack} meta={p.Pack.Meta} key={p.PackID} />)}
            </div>
        </section>
    );
}
