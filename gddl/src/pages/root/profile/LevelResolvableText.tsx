import { useQuery } from "@tanstack/react-query";
import { GetLevel } from "../../../api/levels";
import { Link } from "react-router-dom";

export default function LevelResolvableText({ levelID, isLast }: { levelID: number, isLast: boolean }) {
    const { data } = useQuery({
        queryKey: ['level', levelID],
        queryFn: () => GetLevel(levelID),
    });

    if (data === undefined || data === null) return;
    return (
        <Link to={'/level/' + levelID} className='underline'>{data.Name}{!isLast && ' & '}</Link>
    );
}