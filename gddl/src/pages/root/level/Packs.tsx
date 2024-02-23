import { useQuery } from '@tanstack/react-query';
import { GetLevelPacks } from '../../../api/levels';
import PackRef from '../../../components/PackRef/PackRef';

type Props = {
    levelID: number,
}

export default function Packs({ levelID }: Props) {
    const { data: packs } = useQuery({
        queryKey: ['level', levelID, 'packs'],
        queryFn: () => GetLevelPacks(levelID),
    });

    return (
        <section className='mt-4'>
            <h2 className='text-3xl'>Packs</h2>
            {packs?.length === 0 && <p className='mb-0'>This level is not part of any packs</p>}
            <div className='grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-2 text-center max-md:text-sm'>
                {packs?.map((p) => <PackRef pack={p} key={p.ID} />)}
            </div>
        </section>
    );
}