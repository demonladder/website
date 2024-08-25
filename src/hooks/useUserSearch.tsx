import { useState, useEffect, useMemo, useCallback } from 'react';
import { useQuery } from '@tanstack/react-query';
import SearchBox from '../components/SearchBox/SearchBox';
import { TinyUser } from '../api/types/TinyUser';
import SearchUser from '../api/user/SearchUser';
import GetUser from '../api/user/GetUser';

interface Props {
    ID: string,
    userID?: number,
    maxUsersOnList?: number,
    onUserSelect?: (user: TinyUser) => void;
}

export default function useUserSearch({ ID, userID, maxUsersOnList, onUserSelect }: Props) {
    const [search, setSearch] = useState('');
    const [searchQuery, setSearchQuery] = useState('');

    const [activeUser, setActiveUser] = useState<TinyUser>();
    const [isInvalid, setIsInvalid] = useState(false);

    const { data, status } = useQuery({
        queryKey: ['userSearch', searchQuery, { maxUsersOnList }],
        queryFn: () => SearchUser(searchQuery, maxUsersOnList),
    });

    useEffect(() => {
        if (userID !== undefined) {
            GetUser(userID).then((user) => {
                setActiveUser({
                    ID: user.ID,
                    Name: user.Name,
                    PermissionLevel: 0,
                });
                setSearch(user.Name);
            }).catch(console.error);
        }
    }, [userID]);

    useEffect(() => {
        setIsInvalid(false);
    }, [search, activeUser]);

    const clear = useCallback(() => {
        setSearch('');
        setSearchQuery('');
        setActiveUser(undefined);
    }, []);

    const setQuery = useCallback((value: string) => {
        setSearch(value);
        setSearchQuery(value);
    }, []);

    const result = useMemo(() => ({
        activeUser,
        setQuery,
        clear,
        markInvalid: () => setIsInvalid(true),
        SearchBox: (<SearchBox search={search} getLabel={(r) => r.Name} getName={(r) => r.Name} onSearchChange={setSearch} id={ID} list={data?.map((d) => ({
            ...d,
            label: d.Name,
        })) || []} onDelayedChange={setSearchQuery} setResult={(user) => { setActiveUser(user); user && onUserSelect && onUserSelect(user); }} status={status} placeholder='Search user...' invalid={isInvalid} />)
    }), [activeUser, setQuery, clear, search, data, status, ID, onUserSelect, isInvalid]);

    return result;
}