import { useState } from 'react';
import { useVerifiedUsers } from '../hooks/useVerifiedUsers';
import { Heading3 } from '../../../../components/headings';
import PageButtons from '../../../../components/shared/PageButtons';
import VerifiedUser from './VerifiedUser';
import { useVerificationRole } from '../hooks/useVerificationRole';

export default function VerifiedUsers() {
    const [page, setPage] = useState(0);
    const verificationRole = useVerificationRole();
    const users = useVerifiedUsers({
        page,
        verificationRoleID: verificationRole.data?.ID,
    });

    return (
        <section className='mt-8'>
            {users.isPending && <p>Loading...</p>}
            {users.isError && <p>Error: couldn't fetch verified users</p>}
            {users.isSuccess && (
                <div>
                    <Heading3>Verified Users</Heading3>
                    {users.data.total === 0 && <p>No verified users</p>}
                    <PageButtons onPageChange={setPage} page={page} limit={30} total={users.data.total} />
                    <div className='grid grid-cols-1 xl:grid-cols-2 gap-4 mt-3'>
                        {users.data.users.map((user) => (
                            <VerifiedUser user={user} key={'verifiedUser_' + user.ID} />
                        ))}
                    </div>
                    <PageButtons onPageChange={setPage} page={page} limit={30} total={users.data.total} />
                </div>
            )}
        </section>
    );
}
