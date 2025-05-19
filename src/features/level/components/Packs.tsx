import { useQuery } from '@tanstack/react-query';
import { getLevelPacks } from '../api/getLevelPacks';
import PackRef from '../../../components/PackRef/PackRef';
import LoadingSpinner from '../../../components/LoadingSpinner';

type Props = {
    levelID: number,
};

export default function Packs({ levelID }: Props) {
    const { data: packs, status } = useQuery({
        queryKey: ['level', levelID, 'packs'],
        queryFn: () => getLevelPacks(levelID),
    });

    if (status === 'loading' || status === 'error') {
        return (
            <section className='mt-6'>
                <h2 className='text-3xl'>Packs</h2>
                <LoadingSpinner />
            </section>
        );
    }

    return (
        <section className='mt-6'>
            <h2 className='text-3xl'>Packs</h2>
            {packs?.length === 0 && <p className='mb-0'>This level is not part of any packs</p>}
            <div className='grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-2 text-center max-md:text-sm'>
                {packs?.map((pack) => <PackRef pack={pack} meta={pack.Meta} key={pack.ID} />)}
            </div>
        </section>
    );
}
