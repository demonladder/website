import { useQuery } from '@tanstack/react-query';
import React, { useState } from 'react';
import { Level, SearchLevels } from '../api/levels';
import SearchBox from './SearchBox';

type Props = {
    setResult: (e: any) => void,
    id?: string,
}

type Label = {
    label: string,
}

export default function LevelSearchBox({ setResult, id }: Props) {
    const [search, setSearch] = useState('');

    const { status, data } = useQuery({
        queryKey: ['level/search', search],
        queryFn: () => SearchLevels({ name: search, exact: false, chunk: 5 }),
    });

    const update = (search: string) => {
        setSearch(search);
    }

    if (data === undefined) return <></>;
    return <SearchBox id={id} list={data && data.levels.map((d) => {
        const l: Level & Label = {
            ...d,
            label: d.Name + ' by ' + d.Creator,
        }
        return l;
    })} update={update} setResult={setResult} status={status} />
}