import { useState, useEffect } from 'react';
import { useQuery } from '@tanstack/react-query';
import SearchBox from '../components/SearchBox/SearchBox';
import { SearchUser, TinyUser } from '../api/users';

interface Props {
    ID: string,
    onUserSelect?: (user: TinyUser) => void;
}

export default function useUserSearch({ ID, onUserSelect }: Props) {
    const [search, setSearch] = useState('');
    const [searchQuery, setSearchQuery] = useState('');

    const [activeUser, setActiveUser] = useState<TinyUser>();
    const [isInvalid, setIsInvalid] = useState(false);

    const { data, status } = useQuery({
        queryKey: ['userSearch', searchQuery],
        queryFn: () => SearchUser(searchQuery),
    });

    useEffect(() => {
        setIsInvalid(false);
    }, [search, activeUser]);

    function clear() {
        setSearch('');
        setSearchQuery('');
        setActiveUser(undefined);
    }

    return {
        activeUser,
        setQuery: setSearch,
        clear,
        markInvalid: () => setIsInvalid(true),
        SearchBox: (<SearchBox search={search} onSearchChange={setSearch} id={ID} list={data?.map((d) => ({
            ...d,
            label: d.Name,
        })) || []} onDelayedChange={setSearchQuery} setResult={(user) => {setActiveUser(user); user && onUserSelect && onUserSelect(user);}} status={status} invalid={isInvalid} />)
    }
}