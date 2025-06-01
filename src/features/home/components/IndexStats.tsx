import { useQuery } from '@tanstack/react-query';
import { Link } from 'react-router-dom';
import ms from 'ms';
import Container from '../../../components/Container';
import InlineLoadingSpinner from '../../../components/InlineLoadingSpinner';
import { getStats } from '../api/getStats';

function anyOrLoading<T>(value: T) {
    return value ?? (<InlineLoadingSpinner />);
}

export default function IndexStats() {
    const { data, status } = useQuery({
        queryKey: ['stats'],
        queryFn: getStats,
    });

    return (
        <Container className='xl:row-span-3'>
            <h2 className='text-4xl'>Stats</h2>
            {status === 'success' &&
                <div className='flex gap-8 flex-wrap'>
                    <div>
                        <h3 className='text-2xl mt-2'>Users</h3>
                        <p>Total users: {anyOrLoading(data.users)}</p>
                        <p>Registered users: {anyOrLoading(data.registeredUsers)}</p>
                        <p>Active users: {anyOrLoading(data.activeUsers)}</p>
                    </div>
                    <div>
                        <h3 className='text-2xl mt-2'>Levels</h3>
                        <p>Levels: {anyOrLoading(data.totalLevels)}</p>
                        <p>Rated levels: {anyOrLoading(data.totalRatedLevels)}</p>
                        <p>Coverage: {((data.totalRatedLevels ?? 0) / (data.totalLevels ?? 1) * 100).toFixed(2)}%</p>
                    </div>
                    <div>
                        <h3 className='text-2xl mt-2'>Submissions</h3>
                        <p>Total submissions: {anyOrLoading(data.submissions)}</p>
                        <p>Pending submissions: {anyOrLoading(data.pendingSubmissions)}</p>
                        <p>Submissions last 24h: {anyOrLoading(data.recentSubmissions)}</p>
                        <p>Oldest queued submission: {data.oldestQueuedSubmission ? ms(Date.now() - new Date(data.oldestQueuedSubmission.replace(' +00:00', 'Z').replace(' ', 'T')).getTime()) : '0s'} ago</p>
                    </div>
                    <div>
                        <h3 className='text-2xl mt-2'>Top raters:</h3>
                        <ol className='my-1 list-inside list-decimal'>{anyOrLoading(data.topRaters.map((user) => (<li key={user.UserID}><Link to={`/profile/${user.UserID}`}>{user.Name}</Link></li>)))}</ol>
                    </div>
                </div>
            }
        </Container>
    );
}
