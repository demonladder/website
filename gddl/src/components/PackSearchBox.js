import { useQuery } from '@tanstack/react-query';
import React, { useState } from 'react';
import { SearchPacks } from '../api/packs';
import SearchBox from './SearchBox';

export default function PackSearchBox({ setResult }) {
    const [search, setSearch] = useState('');

    const { status, data } = useQuery({
        queryKey: ['packSearch', search],
        queryFn: SearchPacks
    });

    const update = (search) => {
        setSearch(search);
    }

    return <SearchBox list={data && data.map(d => {d.label = d.Name; return d;})} update={update} setResult={setResult} status={status} />
}