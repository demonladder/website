import { useQuery } from '@tanstack/react-query';
import { GetLevelPacks } from '../../../api/levels';
import PackRef from '../../../components/PackRef';

type Props = {
    levelID: number,
}

export default function Packs({ levelID }: Props) {
    const { data: packs } = useQuery({
        queryKey: ['level/packs', levelID],
        queryFn: () => GetLevelPacks(levelID),
    })

    return (
        <div>
            <h2 className='text-3xl'>Packs</h2>
            <div className='grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-2'>
                {packs?.map((p) => <PackRef pack={p} key={p.ID} />)}
                {packs?.length === 0 ? <p className='mb-0'>This level is not part of any packs</p> : null}
            </div>
        </div>
    );
}