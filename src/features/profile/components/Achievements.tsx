import { useQuery } from '@tanstack/react-query';
import { getUserAchievements } from '../api/getUserAchievements';

interface Props {
    userId: number;
}

export function Achievements({ userId }: Props) {
    const { data: userAchievements } = useQuery({
        queryKey: ['user', userId, 'achievements'],
        queryFn: () => getUserAchievements(userId),
    });

    return (
        <ul>
            {userAchievements
                ?.filter((a) => a.iconSource !== null)
                .map((achievement) => (
                    <li key={achievement.id} className='inline-block me-1'>
                        <img src={achievement.iconSource!} alt={achievement.name} className='size-5' />
                    </li>
                ))}
        </ul>
    );
}
