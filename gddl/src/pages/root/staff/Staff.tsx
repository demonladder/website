import { useQuery } from '@tanstack/react-query';
import Container from '../../../components/Container';
import { Link } from 'react-router-dom';
import ProfileTypeIcon from '../../../components/ProfileTypeIcon';
import FloatingLoadingSpinner from '../../../components/FloatingLoadingSpinner';
import GetStaff, { StaffMember } from '../../../api/user/StaffMember';

const titles: { [key: string]: string } = {
    1: 'List helpers',
    2: 'Developers',
    3: 'Moderators',
    4: 'Admins',
    5: 'Co-owners',
    6: 'Owner',
};

const descriptions: { [key: string]: string } = {
    1: 'The GDDL Helpers. They can approve/reject submissions & GDDL pack submissions.',
    2: 'The GDDL Developers.',
    3: 'The GDDL Moderators. They help keep the chatting environment as neat and tolerable as possible.',
    4: 'The GDDL Admins. They oversee the entirety of the server and bypass restrictions.',
    6: 'The current owner of GDDL!'
}

function List({ data, permissionLevel }: { data?: StaffMember[], permissionLevel: number }) {
    const filtered = data?.filter((s) => s.PermissionLevel === permissionLevel) || [];

    if (filtered.length === 0 && data !== undefined) return;

    return (
        <div className='p-4 round:rounded-lg mb-2 grid grid-cols-2 lg:grid-cols-4 gap-8'>
            <span className='max-lg:hidden'></span>
            <div className={'text-right break-words text-permission-' + permissionLevel}>
                <h3 className='text-3xl font-bold'>{titles[permissionLevel]} <ProfileTypeIcon roles={} permissionLevel={permissionLevel} /></h3>
                <p>{descriptions[permissionLevel] || 'Description'}</p>
            </div>
            <ul>
                {filtered.map((s, i) => <li key={'staffList_' + permissionLevel + '_' + i}>
                    <Link to={'/profile/' + s.ID} className='underline'>{s.Name}</Link>
                </li>)}
            </ul>
        </div>
    );
}

export default function Staff() {
    const { data, isLoading } = useQuery({
        queryKey: ['staff'],
        queryFn: GetStaff,
    });

    return (
        <Container>
            <h1 className='text-4xl mb-4'>Current staff members</h1>
            <FloatingLoadingSpinner isLoading={isLoading} />
            <div>
                <List data={data} permissionLevel={6} />
                <List data={data} permissionLevel={5} />
                <List data={data} permissionLevel={4} />
                <List data={data} permissionLevel={3} />
                <List data={data} permissionLevel={2} />
                <List data={data} permissionLevel={1} />
            </div>
        </Container>
    );
}