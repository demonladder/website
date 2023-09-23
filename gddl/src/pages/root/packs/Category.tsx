import { CategoryResponse, PackShell } from '../../../api/packs';
import PackRef from '../../../components/PackRef';

interface Props {
    category: CategoryResponse
    packs: PackShell[]
}

export default function Category({ category, packs }: Props) {
    if (packs.length === 0) return;

    return (
        <div className='mb-6'>
            <h4 className='text-xl'>{category.Name}</h4>
            <p className='mb-0'>{category.Description}</p>
            <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3 text-center'>
                {packs.map((p) => (
                    <PackRef pack={p} key={category.Name + p.Name} />
                ))}
            </div>
        </div>
    );
}