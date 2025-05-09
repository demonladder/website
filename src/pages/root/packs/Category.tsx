import CategoryResponse from '../../../api/packs/responses/Category';
import PackRef from '../../../components/PackRef/PackRef';
import { GetPacksResponse } from '../../../api/packs/requests/getPacks';
import Heading2 from '../../../components/headings/Heading2';

interface Props {
    category: CategoryResponse;
    packs: GetPacksResponse['packs'];
}

export default function Category({ category, packs }: Props) {
    if (packs.length === 0) return;

    return (
        <div className='mb-6'>
            <Heading2>{category.Name}</Heading2>
            <p className='mb-0'>{category.Description}</p>
            <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3 text-center'>
                {packs.map((p) => (
                    <PackRef pack={p} meta={p.Meta} key={category.Name + p.Name} />
                ))}
            </div>
        </div>
    );
}
