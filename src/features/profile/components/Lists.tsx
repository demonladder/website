import { Link } from 'react-router';
import { useState } from 'react';
import Heading2 from '../../../components/headings/Heading2';
import { useUserLists } from '../hooks/useUserLists';
import Heading3 from '../../../components/headings/Heading3';
import { secondsToHumanReadable } from '../../../utils/secondsToHumanReadable';
import { IDMapper } from '../../../utils/IDMapper';
import { useTags } from '../../../hooks/api/tags/useTags';
import type { GetUserListsResponse } from '../api/getUserLists';
import useContextMenu from '../../../components/ui/menuContext/useContextMenu';

interface Props {
    userID: number;
}

export default function Lists({ userID }: Props) {
    const [maxLists, setMaxLists] = useState(4);
    const { data: lists } = useUserLists(userID);

    return (
        <section className='mt-8'>
            <Heading2>Lists {(lists?.length ?? 0) > 4 && <button onClick={() => setMaxLists(lists?.length ?? 4)} className='text-base float-right font-normal text-blue-500'>View all</button>}</Heading2>
            <div className='grid gap-4 mt-2' style={{ gridAutoRows: '120px auto auto auto', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))' }}>
                {lists?.slice(0, maxLists).map((list) => (
                    <ListCard key={list.ID} list={list}  />
                ))}
            </div>
        </section>
    );
}

function ListCard({ list }: { list: GetUserListsResponse }) {
    const { data: tags } = useTags();

    const contextMenu = useContextMenu([
        { text: 'Delete', type: 'danger', userID: list.OwnerID },
    ]);

    return (
        <div onContextMenu={contextMenu} className='grid grid-rows-subgrid gap-0 row-span-4 mb-4 bg-theme-700 round:rounded-xl overflow-hidden border border-theme-600'>
            <img width='100%' className='h-[120px] object-cover' src={`https://levelthumbs.prevter.me/thumbnail/${IDMapper(list.thumbnailLevelID ?? 87425029)}`} alt={`Image for ${list.Name}`} />
            <Link to={`/list/${list.ID}`}><Heading3 className='mx-4'>{list.Name}</Heading3></Link>
            <p className='mx-4'>{list.Description ?? <i className='text-theme-400'>No description</i>}</p>
            <div className='text-sm p-4'>
                <p className='text-theme-400'>Created {secondsToHumanReadable((Date.now() - new Date(list.createdAt).getTime()) / 1000)} ago <span className='mx-1'>-</span> modified {secondsToHumanReadable((Date.now() - new Date(list.updatedAt).getTime()) / 1000)} ago</p>
                <ul className='flex flex-wrap gap-2 mt-1'>
                    {list.tags.map((tagID) => tags?.find((tag) => tag.ID === tagID)).map((tag) => (
                        <li><span className='px-2 py-[2px] rounded bg-theme-600'>{tag?.Name}</span></li>
                    ))}
                </ul>
            </div>
        </div>
    );
}
