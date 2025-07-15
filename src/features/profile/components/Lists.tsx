import { Link, useNavigate } from 'react-router-dom';
import { useCallback, useContext } from 'react';
import { List } from '../../list/types/List';
import useDeleteListModal from '../../../hooks/modals/useDeleteListModal';
import useSession from '../../../hooks/useSession';
import { MenuContext } from '../../../components/ui/menuContext/MenuContext';
import Heading2 from '../../../components/headings/Heading2';
import { useUserLists } from '../hooks/useUserLists';

interface Props {
    userID: number;
}

export default function Lists({ userID }: Props) {
    const openDeleteListModal = useDeleteListModal();

    const navigate = useNavigate();
    const session = useSession();

    const lookingAtOwnPage = userID === session.user?.ID;

    const { data: lists } = useUserLists(userID);

    const menuContext = useContext(MenuContext);

    const openContext = useCallback((e: React.MouseEvent, list: List) => {
        if (userID !== session.user?.ID) return;

        e.preventDefault();
        e.stopPropagation();

        menuContext?.setMenuData({
            x: e.clientX,
            y: e.clientY,
            buttons: [
                { text: 'Info', onClick: () => navigate(`/list/${list.ID}`) },
                { text: 'Delete', type: 'danger', onClick: () => openDeleteListModal(list) },
            ],
        });
    }, [menuContext, navigate, openDeleteListModal, session.user?.ID, userID]);

    return (
        <section className='mt-6'>
            <Heading2 id='lists'>Lists</Heading2>
            {(lists?.length ?? 0) > 0
                ? (
                    <table className='w-full text-sm lg:text-xl my-2'>
                        <thead>
                            <tr className='text-sm lg:text-2xl border-b-2'>
                                <th className='text-start'><p className='ps-2'>Name</p></th>
                                <th className='text-start max-lg:hidden'>Description</th>
                                <th>Median tier</th>
                                <th>Average tier</th>
                            </tr>
                        </thead>
                        <tbody>
                            {lists?.map((list) => (
                                <tr className='bg-theme-700' key={list.ID} onContextMenu={(e) => openContext(e, list)}>
                                    <td><Link to={`/list/${list.ID}`} className='block py-1 ps-2 my-2'>{list.Name}</Link></td>
                                    <td className='max-lg:hidden'><p>{list.Description?.slice(0, 64).trim().concat(list.Description.length > 64 ? '...' : '') ?? <i className='text-theme-300'>No description</i>}</p></td>
                                    <td className={`text-center tier-${list.MedianTier ?? 0}`}>
                                        {!list.MedianTier
                                            ? <p><i>N/A</i></p>
                                            : <p><b>{list.MedianTier}</b></p>
                                        }
                                    </td>
                                    <td className={`text-center tier-${list.AverageTier?.toFixed() ?? 0}`}>
                                        {!list.AverageTier
                                            ? <p><i>N/A</i></p>
                                            : <p><b>{list.AverageTier.toFixed(2)}</b></p>
                                        }</td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                )
                : (
                    <p><i>{lookingAtOwnPage ? 'You have' : 'This user has'} not created any lists yet</i></p>
                )
            }
        </section>
    );
}
