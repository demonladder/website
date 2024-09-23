import { useQuery } from '@tanstack/react-query';
import { Link, useNavigate } from 'react-router-dom';
import NewLabel from '../../../components/NewLabel';
import { PrimaryButton } from '../../../components/Button';
import { useCallback } from 'react';
import GetUserLists from '../../../api/user/GetUserLists';
import { useContextMenu } from '../../../components/ui/menuContext/MenuContextContainer';
import List from '../../../api/types/List';
import useDeleteListModal from '../../../hooks/modals/useDeleteListModal';
import useCreateListModal from '../../../hooks/modals/useCreateListModal';
import useUser from '../../../hooks/useUser';

interface Props {
    userID: number;
}

export default function Lists({ userID }: Props) {
    const openDeleteListModal = useDeleteListModal();
    const openCreateListModal = useCreateListModal();

    const navigate = useNavigate();
    const session = useUser();

    const lookingAtOwnPage = userID === session.user?.ID;

    const { data: lists } = useQuery({
        queryKey: ['user', userID, 'lists'],
        queryFn: () => GetUserLists(userID),
    });

    const { createMenu } = useContextMenu();

    const openContext = useCallback((e: React.MouseEvent, list: List) => {
        if (userID !== session.user?.ID) return;

        e.preventDefault();

        createMenu({
            x: e.clientX,
            y: e.clientY,
            buttons: [
                { text: 'Info', onClick: () => navigate(`/list/${list.ID}`) },
                { text: 'Delete', type: 'danger', onClick: () => openDeleteListModal(list) },
            ],
        })
    }, [createMenu, navigate, openDeleteListModal, session.user?.ID, userID]);

    return (
        <section>
            <h2 className='text-3xl mt-6' id='lists'>Lists <NewLabel ID='lists' /></h2>
            {lookingAtOwnPage && <PrimaryButton onClick={() => openCreateListModal(userID)}>Create new list</PrimaryButton>}
            {(lists?.length ?? 0) > 0
                ? (
                    <table className='w-full text-xl my-2'>
                        <thead>
                            <tr className='text-2xl border-b-2'>
                                <th className='text-start'><p className='ps-2'>Name</p></th>
                                <th className='text-start'>Description</th>
                                <th>Median tier</th>
                                <th>Average tier</th>
                            </tr>
                        </thead>
                        <tbody>
                            {lists?.map((list) => (
                                <tr className='bg-gray-700' key={list.ID} onContextMenu={(e) => openContext(e, list)}>
                                    <td><Link to={`/list/${list.ID}`} className='block py-1 ps-2 my-2'>{list.Name}</Link></td>
                                    <td><p>{list.Description?.slice(0, 64).trim().concat(list.Description.length > 64 ? '...' : '') ?? <i className='text-gray-300'>No description</i>}</p></td>
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
                ) : (<p><i>{lookingAtOwnPage ? 'You have not created any lists' : 'This user has not created any lists yet'}</i></p>)
            }
        </section>
    );
}