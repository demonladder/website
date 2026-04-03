import { useQuery } from '@tanstack/react-query';
import { Heading1 } from '../../../components/headings';
import { getAchievements } from './api/getAchievements';
import LoadingSpinner from '../../../components/shared/LoadingSpinner';
import { CreateAchievementForm } from './components/CreateAchievementForm';
import { AchievementCard } from './components/AchievementCard';

export function Achievements() {
    const { data: achievements, status } = useQuery({
        queryKey: ['achievements'],
        queryFn: getAchievements,
    });

    return (
        <div>
            <Heading1>Achievements</Heading1>
            <CreateAchievementForm />
            <LoadingSpinner isLoading={status === 'pending'} />
            {status === 'success' &&
                (achievements.length === 0 ? (
                    <p>
                        <i>No achievements yet</i>
                    </p>
                ) : (
                    <ul className='grid lg:grid-cols-2 xl:grid-cols-3 gap-3'>
                        {achievements.map((a) => (
                            <li key={a.id}>
                                <AchievementCard achievement={a} />
                            </li>
                        ))}
                    </ul>
                ))}
        </div>
    );
}
