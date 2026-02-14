import { useQuery } from '@tanstack/react-query';
import { Link } from 'react-router';
import ms from 'ms';
import Container from '../../../components/layout/Container';
import InlineLoadingSpinner from '../../../components/ui/InlineLoadingSpinner';
import { getStats } from '../api/getStats';
import { Heading2, Heading3 } from '../../../components/headings';

function anyOrLoading<T>(value: T) {
    return value ?? <InlineLoadingSpinner />;
}

function Statistic({ label, children }: { label: string; children: number | string }) {
    return (
        <p>
            {label} <span className='float-right'>{anyOrLoading(children)}</span>
        </p>
    );
}

export default function IndexStats() {
    const { data, status } = useQuery({
        queryKey: ['stats'],
        queryFn: getStats,
    });

    return (
        <Container className='xl:col-span-2'>
            <Heading2>Stats</Heading2>
            {status === 'success' && (
                <div className='grid grid-cols-2 lg:grid-cols-3 xl:grid-cols-2 gap-8'>
                    <div>
                        <Heading3>Users</Heading3>
                        <Statistic label='Total users'>{data.users.now}</Statistic>
                        <Statistic label='Registered users'>{data.registeredUsers}</Statistic>
                        <Statistic label='Active users'>{data.activeUsers}</Statistic>
                    </div>
                    <div>
                        <Heading3>Levels</Heading3>
                        <Statistic label='Levels'>{data.totalLevels.now}</Statistic>
                        <Statistic label='Rated levels'>{data.totalRatedLevels}</Statistic>
                        <Statistic label='Coverage'>
                            {(((data.totalRatedLevels ?? 0) / (data.totalLevels.now ?? 1)) * 100).toFixed(2)}
                        </Statistic>
                    </div>
                    <div>
                        <Heading3>Submissions</Heading3>
                        <Statistic label='Total submissions'>{data.submissions.now}</Statistic>
                        <Statistic label='Pending submissions'>{data.pendingSubmissions.now}</Statistic>
                        <Statistic label='Submissions last 24h'>{data.recentSubmissions}</Statistic>
                        <p>
                            Oldest pending{' '}
                            <span className='float-right'>
                                {data.oldestQueuedSubmission
                                    ? ms(
                                          Date.now() -
                                              new Date(
                                                  data.oldestQueuedSubmission.replace(' +00:00', 'Z').replace(' ', 'T'),
                                              ).getTime(),
                                      )
                                    : '0s'}{' '}
                                ago
                            </span>
                        </p>
                    </div>
                    <div>
                        <Heading3>Top raters</Heading3>
                        <ol className='my-1 list-inside list-decimal'>
                            {anyOrLoading(
                                data.topRaters.map((user) => (
                                    <li key={user.UserID}>
                                        <Link to={`/profile/${user.UserID}`}>{user.Name}</Link>
                                    </li>
                                )),
                            )}
                        </ol>
                    </div>
                </div>
            )}
        </Container>
    );
}
