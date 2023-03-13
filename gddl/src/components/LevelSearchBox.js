import { useQuery } from '@tanstack/react-query';
import React, { useState } from 'react';
import { SearchLevels } from '../api/levels';
import SearchBox from './SearchBox';

export default function LevelSearchBox({ setResult }) {
    const [search, setSearch] = useState('');

    const { status, data } = useQuery({
        queryKey: ['levelSearch', search],
        queryFn: (context) => SearchLevels(context.queryKey[1])
    });

    const update = (search) => {
        setSearch(search);
    }

    return <SearchBox list={data && data.map(d => {d.label = d.Name + ' by ' + d.Creator; return d;})} update={update} setResult={setResult} status={status} />
}