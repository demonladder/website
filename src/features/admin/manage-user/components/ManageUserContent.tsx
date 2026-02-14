import { useParams } from 'react-router';
import EditInformation from './EditInformation';
import Notes from './Notes';
import Roles from './Roles';
import BanHistory from './BanHistory';
import { useQuery } from '@tanstack/react-query';
import GetUser from '../../../../api/user/GetUser';
import InlineLoadingSpinner from '../../../../components/ui/InlineLoadingSpinner';
import { useDocumentTitle } from 'usehooks-ts';
import Submissions from './Submissions';

export default function ManageUserContent() {
    const userID = useParams().userID;

    const { data: fetchedUser, status } = useQuery({
        queryKey: ['user', parseInt(userID ?? '-1')],
        queryFn: () => GetUser(parseInt(userID ?? '-1')),
        enabled: userID !== undefined,
    });

    useDocumentTitle(`Editing user ${fetchedUser?.Name ?? '...'}`);

    if (userID === undefined) return;
    if (status === 'pending') return <InlineLoadingSpinner />;
    if (status === 'error') return <p>Error: couldn't fetch user</p>;

    return (
        <>
            <p>
                Selected user:{' '}
                <b>
                    {fetchedUser.ID} ({fetchedUser.Name})
                </b>
            </p>
            <div className='grid lg:grid-cols-2 gap-6'>
                <EditInformation user={fetchedUser} />
                <Submissions user={fetchedUser} />
                <Roles user={fetchedUser} />
                <Notes user={fetchedUser} />
                <BanHistory user={fetchedUser} />
            </div>
        </>
    );
}
