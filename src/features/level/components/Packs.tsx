import { useQuery } from '@tanstack/react-query';
import { getLevelPacks } from '../api/getLevelPacks';
import PackRef from '../../../components/PackRef/PackRef';
import LoadingSpinner from '../../../components/shared/LoadingSpinner';
import LevelMeta from '../types/LevelMeta';
import { useInView } from 'react-intersection-observer';
import { Heading2 } from '../../../components/headings';

interface Props {
    levelID: number;
    meta: LevelMeta;
}

export default function Packs({ levelID, meta }: Props) {
    const { ref, inView } = useInView();
    const { data: packs, status } = useQuery({
        queryKey: ['level', levelID, 'packs'],
        queryFn: () => getLevelPacks(levelID),
        enabled: inView,
    });

    return (
        <section className='mt-6' ref={ref}>
            <Heading2>Packs</Heading2>
            {status === 'pending' && <LoadingSpinner />}
            {status === 'success' && (
                <>
                    {packs?.length === 0 && <p className='mb-0'>{meta.Name} is not in any packs</p>}
                    <div className='grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-2 text-center max-md:text-sm'>
                        {packs?.map((pack) => (
                            <PackRef pack={pack} meta={pack.Meta} key={pack.ID} />
                        ))}
                    </div>
                </>
            )}
        </section>
    );
}
