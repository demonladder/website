import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { TinyUser, SearchUser } from '../api/users';
import SearchBox from './SearchBox/SearchBox';

interface Props {
    setResult: (e: TinyUser | undefined) => void,
    id: string,
    invalid?: boolean,
}

interface UserType extends TinyUser {
    label: string;
}

export default function UserSearchBox({ setResult, id, invalid = false }: Props) {
    const [search, setSearch] = useState('');
    const [searchQuery, setSearchQuery] = useState('');

    const { status, data: users = [] } = useQuery({
        queryKey: ['userSearch', searchQuery],
        queryFn: () => SearchUser(searchQuery)
    });

    return <SearchBox<UserType> search={search} getLabel={(r) => r.Name} getName={(r) => r.Name} onSearchChange={setSearch} id={id} list={users.map((d) => ({...d, label: d.Name}))} onDelayedChange={setSearchQuery} setResult={setResult} status={status} placeholder='Search user...' invalid={invalid} />
}