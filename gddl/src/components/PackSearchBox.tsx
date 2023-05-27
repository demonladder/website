import { useQuery } from '@tanstack/react-query';
import React, { useState } from 'react';
import { SearchPacks } from '../api/packs';
import SearchBox from './SearchBox';

type Props = {
    setResult: (e: any) => void,
}

type Pack = {
    label: string,
    Name: string,
}

export default function PackSearchBox({ setResult }: Props) {
    const [search, setSearch] = useState('');

    const { status, data } = useQuery({
        queryKey: ['packSearch', search],
        queryFn: () => SearchPacks(search)
    });

    const update = (search: string) => {
        setSearch(search);
    }

    return <SearchBox list={data && data.map((d: Pack) => {d.label = d.Name; return d;})} update={update} setResult={setResult} status={status} />
}