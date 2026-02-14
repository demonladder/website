import { useState, useEffect, useMemo, useCallback } from 'react';
import { useQuery } from '@tanstack/react-query';
import SearchBox from '../components/SearchBox/SearchBox';
import { searchUsers, type UserWithRoles } from '../api/user/searchUsers';
import GetUser from '../api/user/GetUser';

interface Props {
    ID: string;
    userID?: number;
    maxUsersOnList?: number;
    onUserSelect?: (user: UserWithRoles) => void;
}

export default function useUserSearch({ ID, userID, maxUsersOnList, onUserSelect }: Props) {
    const [search, setSearch] = useState('');
    const [searchQuery, setSearchQuery] = useState('');

    const [activeUser, setActiveUser] = useState<UserWithRoles>();
    const [isInvalid, setIsInvalid] = useState(false);

    const { data, status } = useQuery({
        queryKey: ['userSearch', searchQuery, { maxUsersOnList }],
        queryFn: () => searchUsers({ name: searchQuery, limit: maxUsersOnList }),
    });

    useEffect(() => {
        if (userID !== undefined) {
            GetUser(userID)
                .then((user) => {
                    setActiveUser({
                        ID: user.ID,
                        Name: user.Name,
                        Introduction: user.Introduction,
                        avatar: user.avatar,
                        roles: user.Roles,
                    });
                })
                .catch(console.error);
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

    const onSetResult = useCallback(
        (user?: UserWithRoles) => {
            setActiveUser(user);
            if (user && onUserSelect) onUserSelect(user);
        },
        [onUserSelect],
    );

    const result = useMemo(
        () => ({
            activeUser,
            setQuery,
            clear,
            markInvalid: () => setIsInvalid(true),
            SearchBox: (
                <SearchBox
                    value={search}
                    getLabel={(r) => r.Name}
                    getName={(r) => r.Name}
                    onChange={setSearch}
                    onDebouncedChange={setSearchQuery}
                    id={ID}
                    list={
                        data?.data.map((d) => ({
                            ...d,
                            label: d.Name,
                        })) || []
                    }
                    onResult={onSetResult}
                    status={status}
                    placeholder='Search user...'
                    invalid={isInvalid}
                />
            ),
        }),
        [activeUser, setQuery, clear, search, setSearch, ID, data, onSetResult, status, isInvalid],
    );

    return result;
}
