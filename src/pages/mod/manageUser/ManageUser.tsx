import useUserSearch from '../../../hooks/useUserSearch';
import { Outlet, useNavigate } from 'react-router-dom';

export default function ManageUser() {
    const navigate = useNavigate();
    const { SearchBox } = useUserSearch({
        ID: 'user-search',
        maxUsersOnList: 10,
        onUserSelect: (user) => navigate(user.ID.toString()),
    });

    return (
        <div>
            <h2 className='text-2xl mb-4'>Manage User</h2>
            {SearchBox}
            <Outlet />
        </div>
    );
}