import { Link } from 'react-router';
import useUserQuery from '../../hooks/queries/useUserQuery';

export default function UserLink({ userID }: { userID: number }) {
    const { data } = useUserQuery(userID);

    return (
        <Link to={`/profile/${userID}`} className='link'>
            {data?.Name ?? userID}
        </Link>
    );
}
