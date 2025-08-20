import { useQuery } from '@tanstack/react-query';
import { Link } from 'react-router';
import ms from 'ms';
import Container from '../../../components/Container';
import InlineLoadingSpinner from '../../../components/InlineLoadingSpinner';
import { getStats } from '../api/getStats';
import Heading2 from '../../../components/headings/Heading2';
import Heading3 from '../../../components/headings/Heading3';

function anyOrLoading<T>(value: T) {
    return value ?? (<InlineLoadingSpinner />);
}

export default function IndexStats() {
    const { data, status } = useQuery({
        queryKey: ['stats'],
        queryFn: getStats,
    });

    return (
        <Container className='xl:col-span-2'>
            <Heading2>Stats</Heading2>
            {status === 'success' &&
                <div className='flex gap-8 flex-wrap'>
                    <div>
                        <Heading3 className='mt-2'>Users</Heading3>
                        <p>Total users: {anyOrLoading(data.users)}</p>
                        <p>Registered users: {anyOrLoading(data.registeredUsers)}</p>
                        <p>Active users: {anyOrLoading(data.activeUsers)}</p>
                    </div>
                    <div>
                        <Heading3 className='mt-2'>Levels</Heading3>
                        <p>Levels: {anyOrLoading(data.totalLevels)}</p>
                        <p>Rated levels: {anyOrLoading(data.totalRatedLevels)}</p>
                        <p>Coverage: {((data.totalRatedLevels ?? 0) / (data.totalLevels ?? 1) * 100).toFixed(2)}%</p>
                    </div>
                    <div>
                        <Heading3 className='mt-2'>Submissions</Heading3>
                        <p>Total submissions: {anyOrLoading(data.submissions)}</p>
                        <p>Pending submissions: {anyOrLoading(data.pendingSubmissions)}</p>
                        <p>Submissions last 24h: {anyOrLoading(data.recentSubmissions)}</p>
                        <p>Oldest queued submission: {data.oldestQueuedSubmission ? ms(Date.now() - new Date(data.oldestQueuedSubmission.replace(' +00:00', 'Z').replace(' ', 'T')).getTime()) : '0s'} ago</p>
                    </div>
                    <div>
                        <Heading3 className='mt-2'>Top raters</Heading3>
                        <ol className='my-1 list-inside list-decimal'>{anyOrLoading(data.topRaters.map((user) => (<li key={user.UserID}><Link to={`/profile/${user.UserID}`}>{user.Name}</Link></li>)))}</ol>
                    </div>
                </div>
            }
        </Container>
    );
}
