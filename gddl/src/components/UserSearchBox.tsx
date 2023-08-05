import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import SearchBox from './SearchBox/SearchBox';
import { SearchUser } from '../api/users';

type Props = {
    setResult: (e: any) => void,
    id: string,
    invalid?: boolean,
}

export default function UserSearchBox({ setResult, id, invalid = false }: Props) {
    const [search, setSearch] = useState('');

    const { status, data: users = [] } = useQuery({
        queryKey: ['userSearch', search],
        queryFn: () => SearchUser(search)
    });

    const update = (search: string) => {
        setSearch(search);
    }

    return <SearchBox id={id} list={users.map((d) => ({...d, label: d.Name}))} update={update} setResult={setResult} status={status} placeholder='Search user...' invalid={invalid} />
}