import { useState, useEffect } from 'react';
import { useQuery } from '@tanstack/react-query';
import SearchBox from '../components/SearchBox/SearchBox';
import { SearchUser, User } from '../api/users';

interface Props {
    ID: string,
}

export default function useUserSearch({ ID }: Props) {
    const [search, setSearch] = useState('');
    const [activeUser, setActiveUser] = useState<User>();
    const [isInvalid, setIsInvalid] = useState(false);

    const { data, status } = useQuery({
        queryKey: ['userSearch', search],
        queryFn: () => SearchUser(search),
    });

    useEffect(() => {
        setIsInvalid(false);
    }, [search, activeUser]);

    return {
        activeUser,
        markInvalid: () => setIsInvalid(true),
        SearchBox: (<SearchBox id={ID} list={data?.map((d) => ({
            ...d,
            label: d.Name,
        })) || []} update={setSearch} setResult={setActiveUser} status={status} invalid={isInvalid} />)
    }
}