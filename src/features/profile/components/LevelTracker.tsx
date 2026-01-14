import { Link } from 'react-router';
import Tracker from './Tracker';
import { useLevel } from '../../level/hooks/useLevel';
import InlineLoadingSpinner from '../../../components/ui/InlineLoadingSpinner';

interface Props {
    levelID: number | null;
    title: string;
}

export default function LevelTracker({ levelID, title }: Props) {
    const { data, status } = useLevel(levelID);

    if (levelID === null) {
        return (
            <Tracker>
                <b>{title}:</b>
                <p className='link-disable text-theme-400'>None</p>
            </Tracker>
        );
    }

    return (
        <Tracker>
            <b>{title}:</b>
            <Link to={'/level/' + levelID} className='underline'><InlineLoadingSpinner isLoading={status === 'pending'} /> {data?.Meta.Name ?? levelID}</Link>
        </Tracker>
    );
}
