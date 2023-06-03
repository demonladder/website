import { useQuery } from '@tanstack/react-query';
import React, { useState } from 'react';
import { SearchPacks } from '../api/packs';
import SearchBox from './SearchBox';

type Props = {
    setResult: (e: any) => void,
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

    if (data === undefined) return <></>;
    return <SearchBox list={data.packs.map((d) => {return {...d, label: d.Name}})} update={update} setResult={setResult} status={status} />
}