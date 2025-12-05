import { Link } from 'react-router';
import { useCallback, useContext } from 'react';
import { List } from '../../list/types/List';
import useDeleteListModal from '../../../hooks/modals/useDeleteListModal';
import useSession from '../../../hooks/useSession';
import { MenuContext } from '../../../components/ui/menuContext/MenuContext';
import Heading2 from '../../../components/headings/Heading2';
import { useUserLists } from '../hooks/useUserLists';
import { useInView } from 'react-intersection-observer';
import Heading3 from '../../../components/headings/Heading3';
import { secondsToHumanReadable } from '../../../utils/secondsToHumanReadable';
import { IDMapper } from '../../../utils/IDMapper';

interface Props {
    userID: number;
}

// export default function Lists({ userID }: Props) {
//     const openDeleteListModal = useDeleteListModal();
//     const { ref, inView } = useInView();

//     const session = useSession();

//     const lookingAtOwnPage = userID === session.user?.ID;

//     const { data: lists } = useUserLists(userID, {
//         enabled: inView,
//     });

//     const menuContext = useContext(MenuContext);

//     const openContext = useCallback((e: React.MouseEvent, list: List) => {
//         if (userID !== session.user?.ID) return;

//         e.preventDefault();
//         e.stopPropagation();

//         menuContext?.setMenuData({
//             x: e.clientX,
//             y: e.clientY,
//             buttons: [
//                 { text: 'Info', to: `/list/${list.ID}` },
//                 { text: 'Delete', type: 'danger', onClick: () => openDeleteListModal(list) },
//             ],
//         });
//     }, [menuContext, openDeleteListModal, session.user?.ID, userID]);

//     return (
//         <section className='mt-6' ref={ref}>
//             <Heading2 id='lists'>Lists</Heading2>
//             {(lists?.length ?? 0) > 0
//                 ? (
//                     <table className='w-full text-sm lg:text-xl my-2'>
//                         <thead>
//                             <tr className='text-sm lg:text-2xl border-b-2'>
//                                 <th className='text-start'><p className='ps-2'>Name</p></th>
//                                 <th className='text-start max-lg:hidden'>Description</th>
//                                 <th>Median tier</th>
//                                 <th>Average tier</th>
//                             </tr>
//                         </thead>
//                         <tbody>
//                             {lists?.map((list) => (
//                                 <tr className='bg-theme-700' key={list.ID} onContextMenu={(e) => openContext(e, list)}>
//                                     <td><Link to={`/list/${list.ID}`} className='block py-1 ps-2 my-2'>{list.Name}</Link></td>
//                                     <td className='max-lg:hidden'><p>{list.Description?.slice(0, 64).trim().concat(list.Description.length > 64 ? '...' : '') ?? <i className='text-theme-300'>No description</i>}</p></td>
//                                     <td className={`text-center tier-${list.MedianTier ?? 0}`}>
//                                         {!list.MedianTier
//                                             ? <p><i>N/A</i></p>
//                                             : <p><b>{list.MedianTier}</b></p>
//                                         }
//                                     </td>
//                                     <td className={`text-center tier-${list.AverageTier?.toFixed() ?? 0}`}>
//                                         {!list.AverageTier
//                                             ? <p><i>N/A</i></p>
//                                             : <p><b>{list.AverageTier.toFixed(2)}</b></p>
//                                         }</td>
//                                 </tr>
//                             ))}
//                         </tbody>
//                     </table>
//                 )
//                 : (
//                     <p><i>{lookingAtOwnPage ? 'You have' : 'This user has'} not created any lists yet</i></p>
//                 )
//             }
//         </section>
//     );
// }

export default function Lists({ userID }: Props) {
    const { data: lists } = useUserLists(userID);

    return (
        <section>
            <Heading2>Lists</Heading2>
            <div className='grid gap-4 mt-2' style={{ gridAutoRows: '120px auto auto auto', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))' }}>
                {lists?.map((list) => (
                    <div key={list.ID} className='grid grid-rows-subgrid gap-0 row-span-4 mb-4 bg-theme-700 round:rounded-xl overflow-hidden border border-theme-600'>
                        <img width='100%' className='h-30 object-cover' src={`https://levelthumbs.prevter.me/thumbnail/${IDMapper(list.thumbnailLevelID ?? 87425029)}`} alt={`Image for ${list.Name}`} />
                        <Link to={`/list/${list.ID}`}><Heading3 className='mx-4'>{list.Name}</Heading3></Link>
                        <p className='mx-4'>{list.Description ?? <i className='text-theme-400'>No description</i>}</p>
                        <div className='text-sm p-4'>
                            <p className='text-theme-400'>Created {secondsToHumanReadable((Date.now() - new Date(list.createdAt).getTime()) / 1000)} ago <span className='mx-1'>-</span> modified {secondsToHumanReadable((Date.now() - new Date(list.updatedAt).getTime()) / 1000)} ago</p>
                            <ul className='flex flex-wrap gap-2 mt-1'>
                                <li><span className='px-2 py-[2px] rounded bg-theme-600'>2.2</span></li>
                                <li><span className='px-2 py-[2px] rounded bg-theme-600'>Cube</span></li>
                                <li><span className='px-2 py-[2px] rounded bg-theme-600'>Extreme</span></li>
                            </ul>
                        </div>
                    </div>
                ))}
            </div>
        </section>
    );
}
