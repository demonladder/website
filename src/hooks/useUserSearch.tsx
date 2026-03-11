import { useState, useEffect, useCallback, useEffectEvent } from 'react';
import { useQuery } from '@tanstack/react-query';
import SearchBox from '../components/SearchBox/SearchBox';
import { searchUsers, type UserWithRoles } from '../api/user/searchUsers';
import GetUser from '../api/user/GetUser';

interface Props {
    ID: string;
    isInvalid?: boolean;
    maxUsersOnList?: number;
    onUser: (user: UserWithRoles | undefined) => void;
    userID?: number;
}

export default function useUserSearch({ ID, isInvalid, userID, maxUsersOnList, onUser }: Props) {
    const [search, setSearch] = useState('');
    const [searchQuery, setSearchQuery] = useState('');

    const { data, status } = useQuery({
        queryKey: ['userSearch', searchQuery, { maxUsersOnList }],
        queryFn: () => searchUsers({ name: searchQuery, limit: maxUsersOnList }),
    });

    const defaultQuery = useQuery({
        queryKey: ['user', userID],
        queryFn: () => GetUser(userID!),
        enabled: userID !== undefined,
    });

    const onUserEvent = useEffectEvent(onUser);
    useEffect(() => {
        if (search === '') onUserEvent(undefined);
    }, [search]);

    useEffect(() => {
        if (!defaultQuery.data?.Name) return;

        // eslint-disable-next-line react-hooks/set-state-in-effect
        setSearch(defaultQuery.data.Name);
    }, [defaultQuery.data?.Name]);

    const clear = useCallback(() => {
        setSearch('');
        setSearchQuery('');
        onUser(undefined);
    }, [onUser]);

    const setText = useCallback((value: string) => {
        setSearchQuery(value);
    }, []);

    const handleResult = useCallback(
        (user?: UserWithRoles) => {
            setSearch(user?.Name ?? '-');
            onUser(user);
        },
        [onUser],
    );

    return {
        setText,
        clear,
        SearchBox: (
            <SearchBox
                value={search}
                getLabel={(r) => r.Name}
                getName={(r) => r.Name}
                onChange={setSearch}
                onDebouncedChange={setSearchQuery}
                id={ID}
                list={data?.data ?? []}
                onResult={handleResult}
                status={status}
                placeholder='Search user...'
                invalid={isInvalid}
                overWriteInput
            />
        ),
    };
}
