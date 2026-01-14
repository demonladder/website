import Heading3 from '../../../../components/headings/Heading3';
import PageButtons from '../../../../components/shared/PageButtons';
import { useUsersEligibleForVerification } from '../hooks/useUsersEligibleForVerification';
import EligibleUser from './EligibleUser';
import { NumberParam, useQueryParam, withDefault } from 'use-query-params';

export default function EligibleUsers() {
    const [page, setPage] = useQueryParam('page', withDefault(NumberParam, 0));
    const users = useUsersEligibleForVerification({ page });

    return (
        <section className='mt-8'>
            <Heading3>Eligible Users</Heading3>
            <div>
                {users.isPending && <p>Loading...</p>}
                {users.isError && <p>Error: couldn't fetch eligible users</p>}
                {users.isSuccess && (
                    <div>
                        {users.data.total === 0 && <p>No eligible users</p>}
                        <div className='grid grid-cols-1 xl:grid-cols-2 gap-4'>
                            {users.data.users.map((user) => (
                                <EligibleUser userID={user.ID} submissions={user.submissions} distinctApprovals={user.distinctApprovals} key={'eligibleUser_' + user.ID} />
                            ))}
                        </div>
                        <PageButtons onPageChange={setPage} meta={{ page, limit: 4, total: users.data.total }} />
                    </div>
                )}
            </div>
        </section>
    );
}
