import { Link } from 'react-router-dom';
import useUserQuery from '../hooks/queries/useUserQuery';

export default function UserLink({ userID }: { userID: number }) {
    const { data } = useUserQuery(userID);

    return (
        <Link to={'/profile/' + userID} className={data !== undefined ? 'underline font-bold' : ''}>
            {data !== undefined
                ? data.Name
                : userID
            }
        </Link>
    );
}