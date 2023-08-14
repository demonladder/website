import { useQuery } from '@tanstack/react-query';
import { Link } from 'react-router-dom';
import { GetLevel } from '../../../api/levels';
import LoadingSpinner from '../../../components/LoadingSpinner';
import Tracker from './Tracker';

type Props = {
    levelID: number | null,
    title: string,
};

export default function LevelTracker({ levelID, title }: Props) {
    const { data, status } = useQuery({
        queryKey: ['level', levelID],
        queryFn: () => GetLevel(levelID),
    });

    if (status === 'loading') {
        return (
            <Tracker>
                <p>{title}:</p>
                <Link to={'/level/' + levelID} className='link-disable'><LoadingSpinner /></Link>
            </Tracker>);
    }

    if (!data || levelID === null) {
        return (
            <Tracker>
                <p>{title}:</p>
                <p className='link-disable text-gray-400'>None</p>
            </Tracker>
        );
    }

    return (
        <Tracker>
            <p>{title}:</p>
            <Link to={'/level/' + levelID} className='underline'>{data.Name}</Link>
        </Tracker>
    );
}