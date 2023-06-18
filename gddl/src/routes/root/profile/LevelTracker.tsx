import * as React from 'react';
import { useQuery } from '@tanstack/react-query';
import { Link } from 'react-router-dom';
import { GetLevel } from '../../../api/levels';
import LoadingSpinner from '../../../components/LoadingSpinner';

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
            <div className='tracker'>
                <p>{title}:</p>
                <Link to={'/level/' + levelID} className='link-disable'><LoadingSpinner /></Link>
            </div>);
    }

    if (data === undefined || levelID === null) {
        return (
            <div className='tracker'>
                <p>{title}:</p>
                <Link to={'/level/' + levelID} className='link-disable'>-</Link>
            </div>
        );
    }

    return (
        <div className='tracker'>
            <p>{title}:</p>
            <Link to={'/level/' + levelID} className='underline'>{data.Name}</Link>
        </div>
    );
}