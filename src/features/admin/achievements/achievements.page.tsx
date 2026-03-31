import { useQuery } from '@tanstack/react-query';
import { Heading1 } from '../../../components/headings';
import { getAchievements } from './api/getAchievements';
import LoadingSpinner from '../../../components/shared/LoadingSpinner';
import { Link } from 'react-router';
import { routes } from '../../../routes/route-definitions';

export function Achievements() {
    const { data: achievements, status } = useQuery({
        queryKey: ['achievements'],
        queryFn: getAchievements,
    });

    return (
        <div>
            <Heading1>Achievements</Heading1>
            <Link
                to={routes.staff.createAchievement.href()}
                className='inline-block bg-primary text-white px-4 py-2 my-2 rounded'
            >
                Create Achievement
            </Link>
            <LoadingSpinner isLoading={status === 'pending'} />
            {status === 'success' &&
                (achievements.length === 0 ? (
                    <p>No achievements yet</p>
                ) : (
                    <ul>
                        {achievements.map((a) => (
                            <li key={a.id}>{a.name}</li>
                        ))}
                    </ul>
                ))}
        </div>
    );
}
