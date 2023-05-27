import { useQuery } from '@tanstack/react-query';
import React, { useState } from 'react';
import { GetLevels } from '../api/levels';
import SearchBox from './SearchBox';

type Props = {
    setResult: (e: any) => void
}

type Level = {
    label: string,
    Name: string,
    Creator: string,
}

export default function LevelSearchBox({ setResult }: Props) {
    const [search, setSearch] = useState('');

    const { status, data } = useQuery({
        queryKey: ['levelSearch', search],
        queryFn: () => GetLevels({ name: search, exact: false })
    });

    const update = (search: string) => {
        setSearch(search);
    }

    return <SearchBox list={data && data.map((d: Level) => {d.label = d.Name + ' by ' + d.Creator; return d;})} update={update} setResult={setResult} status={status} />
}