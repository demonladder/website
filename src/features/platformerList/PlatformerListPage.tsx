import { useQuery } from '@tanstack/react-query';
import { Heading1 } from '../../components/headings';
import Page from '../../components/layout/Page';
import { getPlatformerList } from './api/getPlatformerList';
import { PlatformerListLevel } from './components/PlatformerListLevel';

export default function PlatformerList() {
    const { data } = useQuery({
        queryKey: ['platformerList'],
        queryFn: getPlatformerList,
    });

    return (
        <Page>
            <Heading1>Platformer list</Heading1>
            <p className='mb-2'>As there currently aren't enough platformer levels to put them into tiers, we have created this temporary ranking of all the platformer demons. The position of each level is decided by our community until we're able to generalise the levels into tiers.</p>
            <div className='grid grid-cols-1 gap-3'>
                {data?.sort((a, b) => a.Position > b.Position ? 1 : -1).map((level) => (<PlatformerListLevel level={level} />))}
            </div>
        </Page>
    );
}
