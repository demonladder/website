import { useState, useEffect, useMemo, useCallback } from 'react';
import { useQuery } from '@tanstack/react-query';
import SearchBox from '../components/SearchBox/SearchBox';
import SearchUser from '../api/user/SearchUser';
import GetUser from '../api/user/GetUser';
import User from '../api/types/User';

interface Props {
    ID: string,
    userID?: number,
    maxUsersOnList?: number,
    onUserSelect?: (user: User) => void;
}

export default function useUserSearch({ ID, userID, maxUsersOnList, onUserSelect }: Props) {
    const [search, setSearch] = useState('');
    const [searchQuery, setSearchQuery] = useState('');

    const [activeUser, setActiveUser] = useState<User>();
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
                    AverageEnjoyment: user.AverageEnjoyment,
                    HardestID: user.HardestID,
                    Introduction: user.Introduction,
                    MaxPref: user.MaxPref,
                    MinPref: user.MinPref,
                    CountryCode: user.CountryCode,
                    Pronouns: user.Pronouns,
                });
            }).catch(console.error);
        }
    }, [userID]);

    useEffect(() => {
        setIsInvalid(false);
    }, [activeUser]);

    const clear = useCallback(() => {
        setSearchQuery('');
        setActiveUser(undefined);
    }, []);

    const setQuery = useCallback((value: string) => {
        setSearchQuery(value);
    }, []);

    const onSetResult = useCallback((user?: User) => {
        setActiveUser(user);
        if (user && onUserSelect) onUserSelect(user);
    }, [onUserSelect]);

    const result = useMemo(() => ({
        activeUser,
        setQuery,
        clear,
        markInvalid: () => setIsInvalid(true),
        SearchBox: (<SearchBox value={search} getLabel={(r) => r.Name} getName={(r) => r.Name} onChange={setSearch} onDebouncedChange={setSearchQuery} id={ID} list={data?.map((d) => ({
            ...d,
            label: d.Name,
        })) || []} onResult={onSetResult} status={status} placeholder='Search user...' invalid={isInvalid} />),
    }), [activeUser, setQuery, clear, search, setSearch, ID, data, onSetResult, status, isInvalid]);

    return result;
}
