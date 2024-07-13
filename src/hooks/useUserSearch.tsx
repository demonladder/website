import { useState, useEffect } from 'react';
import { useQuery } from '@tanstack/react-query';
import SearchBox from '../components/SearchBox/SearchBox';
import { TinyUser } from '../api/types/TinyUser';
import SearchUser from '../api/user/SearchUser';

interface Props {
    ID: string,
    maxUsersOnList?: number,
    onUserSelect?: (user: TinyUser) => void;
}

export default function useUserSearch({ ID, maxUsersOnList, onUserSelect }: Props) {
    const [search, setSearch] = useState('');
    const [searchQuery, setSearchQuery] = useState('');

    const [activeUser, setActiveUser] = useState<TinyUser>();
    const [isInvalid, setIsInvalid] = useState(false);

    const { data, status } = useQuery({
        queryKey: ['userSearch', searchQuery, { maxUsersOnList }],
        queryFn: () => SearchUser(searchQuery, maxUsersOnList),
    });

    useEffect(() => {
        setIsInvalid(false);
    }, [search, activeUser]);

    function clear() {
        setSearch('');
        setSearchQuery('');
        setActiveUser(undefined);
    }

    function setQuery(value: string) {
        setSearch(value);
        setSearchQuery(value);
    }

    return {
        activeUser,
        setQuery,
        clear,
        markInvalid: () => setIsInvalid(true),
        SearchBox: (<SearchBox search={search} getLabel={(r) => r.Name} getName={(r) => r.Name} onSearchChange={setSearch} id={ID} list={data?.map((d) => ({
            ...d,
            label: d.Name,
        })) || []} onDelayedChange={setSearchQuery} setResult={(user) => { setActiveUser(user); user && onUserSelect && onUserSelect(user); }} status={status} invalid={isInvalid} />)
    }
}