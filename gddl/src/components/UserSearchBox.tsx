import React, { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import SearchBox from './SearchBox/SearchBox';
import { SearchUser } from '../api/users';

type Props = {
    setResult: (e: any) => void,
    id: string,
}

export default function UserSearchBox({ setResult, id }: Props) {
    const [search, setSearch] = useState('');

    const { status, data: users } = useQuery({
        queryKey: ['userSearch', search],
        queryFn: () => SearchUser(search)
    });

    const update = (search: string) => {
        setSearch(search);
    }

    if (users === undefined) return <></>;
    return <SearchBox id={id} className='userSearchBox' list={users.map((d) => ({...d, label: d.Name}))} update={update} setResult={setResult} status={status} placeholder='Search user...' />
}