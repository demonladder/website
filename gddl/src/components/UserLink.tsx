import { useQuery } from '@tanstack/react-query';
import { GetUser } from '../api/users';
import { Link } from 'react-router-dom';

export default function UserLink({ userID }: { userID: number }) {
    const { data } = useQuery({
        queryKey: ['user', userID],
        queryFn: () => GetUser(userID),
    });

    return (
        <Link to={'/profile/' + userID} className={data !== undefined ? 'underline font-bold' : ''}>
            {data !== undefined
                ? data.Name
                : userID
            }
        </Link>
    );
}