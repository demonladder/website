import React from 'react';
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
            <h2>Packs</h2>
            <div className='row'>
                {packs?.map(p => <div className='px-1 col-12 col-md-6 col-xl-4'><PackRef pack={p} key={p.ID} /></div>)}
                {packs?.length === 0 ? <p className='mb-0'>This level is not part of any packs</p> : null}
            </div>
        </div>
    );
}