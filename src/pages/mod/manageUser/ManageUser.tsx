import Heading2 from '../../../components/headings/Heading2';
import useUserSearch from '../../../hooks/useUserSearch';
import { Outlet, useNavigate } from 'react-router';

export default function ManageUser() {
    const navigate = useNavigate();
    const { SearchBox } = useUserSearch({
        ID: 'user-search',
        maxUsersOnList: 10,
        onUserSelect: (user) => navigate(user.ID.toString()),
    });

    return (
        <div>
            <Heading2 className='mb-4'>Manage User</Heading2>
            {SearchBox}
            <Outlet />
        </div>
    );
}
