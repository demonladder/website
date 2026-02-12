import { useQuery } from '@tanstack/react-query';
import Page from '../../components/layout/Page';
import { Link } from 'react-router';
import UserRoleIcon from '../../components/ui/UserRoleIcon';
import FloatingLoadingSpinner from '../../components/ui/FloatingLoadingSpinner';
import GetStaff from '../../api/user/StaffMember';
import Role from '../../api/types/Role';
import { Heading1 } from '../../components/headings';

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
    6: 'The current owner of GDDL!',
};

function List({ data, roleID }: { data?: { ID: number, Name: string }[], roleID: number }) {
    return (
        <div className='p-4 round:rounded-lg mb-2 grid grid-cols-2 lg:grid-cols-4 gap-8'>
            <span className='max-lg:hidden'></span>
            <div className={`text-right break-words text-permission-${roleID}`}>
                <h3 className='text-3xl font-bold'>{roleTitles[roleID]} <UserRoleIcon roles={[]} /></h3>
                <p>{roleDescriptions[roleID] || 'Description'}</p>
            </div>
            <ul>
                {data?.map((s, i) => <li key={`staffList_${roleID}_${i}`}>
                    <Link to={`/profile/${s.ID}`} className='underline'>{s.Name}</Link>
                </li>)}
            </ul>
        </div>
    );
}

export default function Staff() {
    const { data, isLoading, status } = useQuery({
        queryKey: ['staff'],
        queryFn: GetStaff,
    });

    return (
        <Page>
            <Heading1 className='mb-4'>Current staff members</Heading1>
            <FloatingLoadingSpinner isLoading={isLoading} />
            {status === 'success' &&
                <div>
                    <List data={data.find((role) => role.ID === 6)?.users} roleID={6} />
                    <List data={data.find((role) => role.ID === 5)?.users} roleID={5} />
                    <List data={data.find((role) => role.ID === 4)?.users} roleID={4} />
                    <List data={data.find((role) => role.ID === 3)?.users} roleID={3} />
                    <List data={data.find((role) => role.ID === 2)?.users} roleID={2} />
                </div>
            }
        </Page>
    );
}
