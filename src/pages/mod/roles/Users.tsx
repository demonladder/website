import { useQuery, useQueryClient } from '@tanstack/react-query';
import APIClient from '../../../api/APIClient';
import User from '../../../api/types/User';
import { toast } from 'react-toastify';
import renderToastError from '../../../utils/renderToastError';
import RemoveRoleFromUser from '../../../api/user/RemoveRoleFromUser';
import Heading3 from '../../../components/headings/Heading3';

export default function Users({ roleID }: { roleID: number }) {
    const queryClient = useQueryClient();
    const { data } = useQuery({
        queryKey: ['role', roleID, 'users'],
        queryFn: () => APIClient.get<User[]>(`/roles/${roleID}/users`).then((res) => res.data),
    });

    function removeUser(userID: number) {
        void toast.promise(
            RemoveRoleFromUser(userID, roleID).then(() => {
                void queryClient.invalidateQueries(['role', roleID, 'users']);
                void queryClient.invalidateQueries(['users', userID]);
            }),
            {
                pending: 'Removing role...',
                success: 'Role removed from user',
                error: renderToastError,
            }
        );
    }

    return (
        <section className='mt-4'>
            <Heading3>Users</Heading3>
            {data?.length === 0
                ? <p>No users have this role</p>
                : <>
                    <p>Users with this role:</p>
                    <ul>
                        {data?.map((user) => (
                            <li className='my-2' key={user.ID}><button onClick={() => removeUser(user.ID)}><i className='bx bx-x' /></button> {user.Name}</li>
                        ))}
                    </ul>
                </>
            }
        </section>
    );
}
