import { Link } from "react-router";
import { useLevel } from '../features/level/hooks/useLevel';

interface Props {
    levelID: number;
    isLast?: boolean;
}

export default function LevelResolvableText({ levelID, isLast = true }: Props) {
    const { data } = useLevel(levelID);

    if (data === undefined || data === null) return;
    return (
        <span>
            <Link to={'/level/' + levelID} className='underline'>{data.Meta.Name}</Link>
            {!isLast && ' & '}
        </span>
    );
}
