import { useQuery } from '@tanstack/react-query';
import Container from '../../../components/Container';
import { Link } from 'react-router-dom';
import ProfileTypeIcon from '../../../components/ProfileTypeIcon';
import FloatingLoadingSpinner from '../../../components/FloatingLoadingSpinner';
import GetStaff, { StaffMember } from '../../../api/user/StaffMember';
import Role from '../../../api/types/Role';

const roleTitles: Record<Role['ID'], string> = {
    2: 'List helpers',
    3: 'Developers',
    4: 'Moderators',
    5: 'Admins',
    7: 'Co-owners',
    6: 'Owner',
};

const roleDescriptions: Record<Role['ID'], string> = {
    2: 'The GDDL Helpers. They can approve/reject submissions & GDDL pack submissions.',
    3: 'The GDDL Developers.',
    4: 'The GDDL Moderators. They help keep the chatting environment as neat and tolerable as possible.',
    5: 'The GDDL Admins. They oversee the entirety of the server and bypass restrictions.',
    6: 'The current owner of GDDL!'
}

function List({ data, roleID }: { data?: StaffMember[], roleID: number }) {
    const filtered = data?.filter((s) => s.Roles.includes(roleID)) ?? [];

    if (filtered.length === 0 && data !== undefined) return;

    return (
        <div className='p-4 round:rounded-lg mb-2 grid grid-cols-2 lg:grid-cols-4 gap-8'>
            <span className='max-lg:hidden'></span>
            <div className={`text-right break-words text-permission-${roleID}`}>
                <h3 className='text-3xl font-bold'>{roleTitles[roleID]} <ProfileTypeIcon roles={[]} /></h3>
                <p>{roleDescriptions[roleID] || 'Description'}</p>
            </div>
            <ul>
                {filtered.map((s, i) => <li key={`staffList_${roleID}_${i}`}>
                    <Link to={`/profile/${s.ID}`} className='underline'>{s.Name}</Link>
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
                <List data={data} roleID={6} />
                <List data={data} roleID={5} />
                <List data={data} roleID={4} />
                <List data={data} roleID={3} />
                <List data={data} roleID={2} />
            </div>
        </Container>
    );
}