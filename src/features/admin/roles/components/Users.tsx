import { useQuery, useQueryClient } from '@tanstack/react-query';
import { toast } from 'react-toastify';
import renderToastError from '../../../../utils/renderToastError';
import { rolesClient, usersClient } from '../../../../api';
import { Heading3 } from '../../../../components/headings';

export default function Users({ roleID }: { roleID: number }) {
    const queryClient = useQueryClient();
    const { data } = useQuery({
        queryKey: ['role', roleID, 'users'],
        queryFn: () => rolesClient.listMembers(roleID),
    });

    function removeUser(userID: number) {
        void toast.promise(
            usersClient.removeRole(userID, roleID).then(() => {
                void queryClient.invalidateQueries({ queryKey: ['role', roleID, 'users'] });
                void queryClient.invalidateQueries({ queryKey: ['users', userID] });
            }),
            {
                pending: 'Removing role...',
                success: 'Role removed from user',
                error: renderToastError,
            },
        );
    }

    return (
        <section className='mt-4'>
            <Heading3>Users</Heading3>
            {data?.users.length === 0 ? (
                <p>No users have this role</p>
            ) : (
                <>
                    <p>Users with this role:</p>
                    <ul>
                        {data?.users.map((user) => (
                            <li className='my-2' key={user.ID}>
                                <button onClick={() => removeUser(user.ID)}>
                                    <i className='bx bx-x' />
                                </button>{' '}
                                {user.Name}
                            </li>
                        ))}
                    </ul>
                </>
            )}
        </section>
    );
}
